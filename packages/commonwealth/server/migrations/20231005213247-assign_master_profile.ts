'use strict';

// interface Address {
//   hex: string;
//   id: number;
//   user_id?: number;
//   profile_id?: number;
//   last_active?: Date;
// }

// interface Profile {
//   id: number;
//   user_id?: number;
//   profile_name: string;
//   email: string;
//   bio: string;
//   avatar_url: string;
//   socials: string;
//   background_image: string;
// }

// interface MasterProfile extends Profile {
//   profile_name_last_active?: Date;
//   email_last_active?: Date;
//   bio_last_active?: Date;
//   avatar_url_last_active?: Date;
//   socials_last_active?: Date;
//   background_image_last_active?: Date;
//   user_id_last_active?: Date;
// }

// interface Signer {
//   hex: string; // identifier
//   addresses: Address[];
//   profiles?: MasterProfile[];
//   master_profile?: MasterProfile;
// }

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
        ALTER TABLE "Addresses" ADD COLUMN IF NOT EXISTS "legacy_user_id" INTEGER NULL;
        ALTER TABLE "Addresses" ADD COLUMN IF NOT EXISTS "legacy_profile_id" INTEGER NULL;
        `,
        { raw: true, transaction: t }
      );
    });

    await queryInterface.sequelize.transaction(async (t) => {
      // get all addresses with hex and their profiles by profile_id:
      const [hexAddresses] = await queryInterface.sequelize.query(
        `
        SELECT hex, id, user_id, profile_id
        FROM "Addresses"
        WHERE hex IS NOT NULL AND profile_id IS NOT NULL;
        `,
        { transaction: t }
      );

      console.log('hexAddresses', hexAddresses.length);

      const profileIds = hexAddresses
        // .filter((address) => !!address.profile_id)
        .map((address) => address.profile_id)
        .join(',');

      console.log('profileIds', profileIds.split(',').length);

      const [profiles] = await queryInterface.sequelize.query(
        `
          SELECT * from "Profiles"
          WHERE "id" IN (${profileIds});  
          `,
        { transaction: t }
      );

      let signers = [];
      hexAddresses.forEach((address) => {
        const signer = signers.find((signer) => signer.hex === address.hex);
        const profile = profiles.find((p) => p.id === address.profile_id);
        if (signer) {
          signer.addresses.push(address);
          signer.profiles.push(profile);
        } else {
          signers.push({
            hex: address.hex,
            addresses: [address],
            profiles: [profile],
          });
        }
      });

      console.log('signers', signers.length);

      const signersWithMultipleProfiles = signers.filter(
        (signer) => signer.profiles.length > 1
      );

      console.log(
        'signersWithMultipleProfiles',
        signersWithMultipleProfiles.length
      );

      // let masterProfiles: MasterProfile[] = [];
      let updateCount = 0;

      signersWithMultipleProfiles.forEach(async (signer) => {
        const masterProfile = signer.profiles.reduce((master, profile) => {
          if (!master) {
            return profile;
          }
          const addressLastActive = signer.addresses.find(
            (a) => a.profile_id === profile.id
          ).last_active;
          if (profile.profile_name) {
            if (addressLastActive > master.profile_name_last_active) {
              master.profile_name = profile.profile_name;
              master.profile_name_last_active = addressLastActive;
            }
          }
          if (profile.email) {
            if (addressLastActive > master.email_last_active) {
              master.email = profile.email;
              master.email_last_active = addressLastActive;
            }
          }
          if (profile.bio) {
            if (addressLastActive > master.bio_last_active) {
              master.bio = profile.bio;
              master.bio_last_active = addressLastActive;
            }
          }
          if (profile.avatar_url) {
            if (addressLastActive > master.avatar_url_last_active) {
              master.avatar_url = profile.avatar_url;
              master.avatar_url_last_active = addressLastActive;
            }
          }
          if (profile.socials) {
            if (addressLastActive > master.socials_last_active) {
              console.log('profile.socials', profile.socials);
              master.socials = profile.socials;
              master.socials_last_active = addressLastActive;
            }
          }
          if (profile.background_image) {
            if (addressLastActive > master.background_image_last_active) {
              master.background_image = profile.background_image;
              master.background_image_last_active = addressLastActive;
            }
          }
          // assign user_id:
          if (profile.user_id) {
            if (addressLastActive > master.user_id_last_active) {
              master.user_id = profile.user_id;
              master.user_id_last_active = addressLastActive;
            }
          }
          return master;
        }, null);
        signer.master_profile = masterProfile;

        if (masterProfile) {
          await queryInterface.sequelize.transaction(async (t) => {
            // Insert the new profile and update the addresses
            try {
              //     const insertQuery = `
              //   INSERT INTO "Profiles" (profile_name, email, bio, avatar_url, socials, background_image, user_id)
              //   VALUES (${
              //     masterProfile.profile_name
              //       ? `'${masterProfile.profile_name}'`
              //       : null
              //   }, ${masterProfile.email ? `'${masterProfile.email}'` : null}, ${
              //       masterProfile.bio ? `'${masterProfile.bio}'` : null
              //     }, ${
              //       masterProfile.avatar_url
              //         ? `'${masterProfile.avatar_url}'`
              //         : null
              //     }, ${
              //       masterProfile.socials ? `'{${masterProfile.socials}}'` : null
              //     }, ${
              //       masterProfile.background_image
              //         ? `'${JSON.stringify(masterProfile.background_image)}'`
              //         : null
              //     }, ${masterProfile.user_id})
              //     RETURNING id;
              // `;

              console.log('masterProfile', masterProfile);

              const { profile_name, email, bio, avatar_url, user_id } =
                masterProfile;

              const [insertedProfile] = await queryInterface.bulkInsert(
                'Profiles',
                [
                  {
                    profile_name,
                    email,
                    bio,
                    avatar_url,
                    socials: masterProfile.socials?.length
                      ? masterProfile.socials
                      : null,
                    background_image: masterProfile.background_image
                      ? JSON.stringify(masterProfile.background_image)
                      : null,
                    user_id,
                  },
                ],
                { transaction: t, returning: true }
              );

              // console.log('insertedProfile', insertedProfile);

              // const [insertedProfile] = await queryInterface.sequelize.query(
              //   insertQuery,
              //   { transaction: t, type: Sequelize.QueryTypes.INSERT }
              // );
              const new_profile_id = insertedProfile.id;

              const updateQuery = `
            UPDATE "Addresses" A
            SET
              legacy_user_id = A.user_id,
              legacy_profile_id = A.profile_id,
              profile_id = ${new_profile_id},
              user_id = ${masterProfile.user_id}
            WHERE A.hex = '${signer.hex}';
          `;

              await queryInterface.sequelize.query(updateQuery, {
                transaction: t,
                raw: true,
              });
            } catch (e) {
              console.log('error', e, e.errors);
              throw new Error(e);
            }
            updateCount++;
          });
        }
      });
      console.log('updateCount', updateCount);
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `
          UPDATE "Addresses" SET profile_id = "Addresses".legacy_profile_id, user_id = "Addresses".legacy_user_id where legacy_profile_id IS NOT NULL;
          ALTER TABLE "Addresses" DROP COLUMN "legacy_user_id";
          ALTER TABLE "Addresses" DROP COLUMN "legacy_profile_id";
        `,
        { raw: true, transaction: t }
      );
    });
  },
};
