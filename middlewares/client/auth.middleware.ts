import { Request, Response, NextFunction } from 'express';
import User from '../../models/user.model';

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.cookies.tokenUser) {
        res.redirect(`/user/login`);
        return;
    }

    const user = await User.findOne({
        tokenUser: req.cookies.tokenUser,
        deleted: false
    }).select("-password");

    if (!user) {
        res.redirect(`/user/login`);
        return;
    }

    next();
}