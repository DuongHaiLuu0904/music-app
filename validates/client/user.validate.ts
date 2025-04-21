import { Request, Response, NextFunction } from 'express';

export const registerPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const loginPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

export const resetPasswordPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.body.password) {
        req.flash('error', 'Vui lòng nhập mật khẩu!');
        
        const backURL: string = req.get("Referrer") || "/";
        res.redirect(backURL);
        return;
    }

    if (!req.body.confirmPassword) {
        req.flash('error', 'Vui lòng xác nhận lại mật khẩu!');
        
        const backURL: string = req.get("Referrer") || "/";
        res.redirect(backURL);
        return;
    }

    if (req.body.password !== req.body.confirmPassword) {
        req.flash('error', 'Mật khẩu không khớp!');
        
        const backURL: string = req.get("Referrer") || "/";
        res.redirect(backURL);
       return;
   }

   next();
}