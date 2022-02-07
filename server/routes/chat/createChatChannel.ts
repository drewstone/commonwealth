import {NextFunction, Request, Response} from "express";
import {DB} from "../../database";

export const Errors = {
    NotLoggedIn: 'Not logged in',
    NotAdmin: 'Must be an admin to create a chat channel',
    NoCommunityId: 'No community id given'
};

export default async (models: DB, req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return next(new Error(Errors.NotLoggedIn));
    }

    // if (!req.user.isAdmin) {
    //     return next(new Error(Errors.NotAdmin))
    // }

    if (!req.body.community_id) {
        return next(new Error(Errors.NoCommunityId))
    }

    const channel = await models.ChatChannel.create({
        name: req.body.name,
        community_id: req.body.community_id,
        category: req.body.category
    });

    return res.json({ status: '200', result: { chat_channel: channel.toJSON() } });
}
