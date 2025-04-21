import { Request, Response } from 'express';
import md5 from 'md5';
import Account from '../../models/account.model';
import { systemConfig } from '../../config/configAdmin' 

// [GET] /auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
    if (req.cookies.token) {
        res.redirect(systemConfig.prefixAdmin + '/dashboard');
    } else {
        res.render('admin/pages/auth/login', {
            title: 'Login'
        });
    }
}

// [POST] /auth/login
export const loginPost = async (req: Request, res: Response): Promise<void> => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false
    });

    if (!user) {
        req.flash('error', 'Tài khoản không tồn tại');
        return res.redirect(systemConfig.prefixAdmin + '/auth/login');
    }

    if (md5(password) !== user.password) {
        req.flash('error', 'Mật khẩu không đúng');
        return res.redirect(systemConfig.prefixAdmin + '/auth/login');
    }

    if (user.status === 'inactive') {
        req.flash('error', 'Tài khoản bị khóa');
        return res.redirect(systemConfig.prefixAdmin + '/auth/login');
    }

    res.cookie('token', user.token);
    
    res.redirect(systemConfig.prefixAdmin + '/dashboard');
}

// [GET] /auth/logout
export const logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('token');
    req.flash('success', 'Đăng xuất thành công');
    res.redirect(systemConfig.prefixAdmin + '/auth/login');
}