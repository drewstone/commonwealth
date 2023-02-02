import type { Sequelize } from 'sequelize';

import type { AddressModelStatic } from './models/address';
import type { AttachmentModelStatic } from './models/attachment';
import type { BanModelStatic } from './models/ban';
import type { ChainModelStatic } from './models/chain';
import type { ChainCategoryModelStatic } from './models/chain_category';
import type { ChainCategoryTypeModelStatic } from './models/chain_category_type';
import type { ChainEntityMetaModelStatic } from './models/chain_entity_meta';
import type { ChainNodeModelStatic } from './models/chain_node';
import type { ChatChannelModelStatic } from './models/chat_channel';
import type { ChatMessageModelStatic } from './models/chat_message';
import type { CollaborationModelStatic } from './models/collaboration';
import type { CommentModelStatic } from './models/comment';
import type { CommunityBannerModelStatic } from './models/community_banner';
import type { CommunityContractModelStatic } from './models/community_contract';
import type { CommunityRoleModelStatic } from './models/community_role';
import type { CommunitySnapshotSpaceModelStatic } from './models/community_snapshot_spaces';
import type { ContractModelStatic } from './models/contract';
import type { ContractAbiModelStatic } from './models/contract_abi';
import type { DiscordBotConfigModelStatic } from './models/discord_bot_config';
import type { DiscussionDraftModelStatic } from './models/discussion_draft';
import type { IdentityCacheStatic } from './models/identity_cache';
import type { LinkedThreadModelStatic } from './models/linked_thread';
import type { LoginTokenModelStatic } from './models/login_token';
import type { NotificationModelStatic } from './models/notification';
import type { NotificationCategoryModelStatic } from './models/notification_category';
import type { NotificationsReadModelStatic } from './models/notifications_read';
import type { OffchainProfileModelStatic } from './models/offchain_profile';
import type { PollModelStatic } from './models/poll';
import type { ProfileModelStatic } from './models/profile';
import type { ReactionModelStatic } from './models/reaction';
import type { RoleModelStatic } from './models/role';
import type { RoleAssignmentModelStatic } from './models/role_assignment';
import type { RuleModelStatic } from './models/rule';
import type { SnapshotProposalModelStatic } from './models/snapshot_proposal';
import type { SnapshotSpaceModelStatic } from './models/snapshot_spaces';
import type { SocialAccountModelStatic } from './models/social_account';
import type { SsoTokenModelStatic } from './models/sso_token';
import type { StarredCommunityModelStatic } from './models/starred_community';
import type { SubscriptionModelStatic } from './models/subscription';
import type { TaggedThreadModelStatic } from './models/tagged_threads';
import type { ThreadModelStatic } from './models/thread';
import type { TokenModelStatic } from './models/token';
import type { TopicModelStatic } from './models/topic';
import type { UserModelStatic } from './models/user';
import type { ViewCountModelStatic } from './models/viewcount';
import type { VoteModelStatic } from './models/vote';
import type { WebhookModelStatic } from './models/webhook';

export type Models = {
  Address: AddressModelStatic;
  Ban: BanModelStatic;
  Chain: ChainModelStatic;
  ChainCategory: ChainCategoryModelStatic;
  ChainCategoryType: ChainCategoryTypeModelStatic;
  ChainEntityMeta: ChainEntityMetaModelStatic;
  ChainNode: ChainNodeModelStatic;
  ChatChannel: ChatChannelModelStatic;
  ChatMessage: ChatMessageModelStatic;
  Contract: ContractModelStatic;
  ContractAbi: ContractAbiModelStatic;
  CommunityContract: CommunityContractModelStatic;
  CommunityRole: CommunityRoleModelStatic;
  CommunitySnapshotSpaces: CommunitySnapshotSpaceModelStatic;
  Collaboration: CollaborationModelStatic;
  CommunityBanner: CommunityBannerModelStatic;
  DiscussionDraft: DiscussionDraftModelStatic;
  DiscordBotConfig: DiscordBotConfigModelStatic;
  IdentityCache: IdentityCacheStatic;
  LinkedThread: LinkedThreadModelStatic;
  LoginToken: LoginTokenModelStatic;
  Notification: NotificationModelStatic;
  NotificationCategory: NotificationCategoryModelStatic;
  NotificationsRead: NotificationsReadModelStatic;
  Attachment: AttachmentModelStatic;
  Comment: CommentModelStatic;
  Poll: PollModelStatic;
  OffchainProfile: OffchainProfileModelStatic;
  Reaction: ReactionModelStatic;
  Thread: ThreadModelStatic;
  Topic: TopicModelStatic;
  ViewCount: ViewCountModelStatic;
  Vote: VoteModelStatic;
  Profile: ProfileModelStatic;
  RoleAssignment: RoleAssignmentModelStatic;
  Role: RoleModelStatic;
  Rule: RuleModelStatic;
  SocialAccount: SocialAccountModelStatic;
  SsoToken: SsoTokenModelStatic;
  StarredCommunity: StarredCommunityModelStatic;
  SnapshotProposal: SnapshotProposalModelStatic;
  Subscription: SubscriptionModelStatic;
  SnapshotSpace: SnapshotSpaceModelStatic;
  Token: TokenModelStatic;
  TaggedThread: TaggedThreadModelStatic;
  User: UserModelStatic;
  Webhook: WebhookModelStatic;
};

export interface DB extends Models {
  sequelize: Sequelize;
  Sequelize: typeof Sequelize;
}
