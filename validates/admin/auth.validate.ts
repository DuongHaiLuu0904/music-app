import { Request, Response, NextFunction } from 'express';

export const loginPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập Email!');

        const backURL: string = req.get("Referrer") || "/";
        res.redirect(backURL);
        return;
    }

    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu!');

        const backURL: string = req.get("Referrer") || "/";
        res.redirect(backURL);
        return;
    }

    next();
}