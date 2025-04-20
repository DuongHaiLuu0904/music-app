import { Request, Response, NextFunction } from 'express';

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập họ tên!');

        const backURL: string = req.get("Referrer") || "/";
        res.redirect(backURL);
        return;
    }

    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');

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

export const createPatch = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.body.fullName) {
        req.flash('error', 'Vui lòng nhập họ tên!');

        const backURL: string = req.get("Referrer") || "/";
        res.redirect(backURL);
        return;
    }

    if (!req.body.email) {
        req.flash('error', 'Vui lòng nhập email!');

        const backURL: string = req.get("Referrer") || "/";
        res.redirect(backURL);
        return;
    }

    next();
}