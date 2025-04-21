import { Request, Response } from 'express';

import User from '../../models/user.model';

import md5 from 'md5';
import { systemConfig } from '../../config/configAdmin';

export const index = async (req: Request, res: Response): Promise<void> => {
    const find: { deleted: boolean } = {
        deleted: false
    };

    const records = await User.find(find).select('-password -token');

    res.render('admin/pages/users/index', {
        title: 'Tài khoản client',
        records: records
    });
};

export const create = async (req: Request, res: Response): Promise<void> => {
    res.render('admin/pages/users/create', {
        title: 'Thêm tài khoản',
    });
};

export const createPost = async (req: Request, res: Response): Promise<void> => {
    // const permission: string[] = res.locals.role.permissions;
    // if (!permission.includes("users_create")) {
    //     req.flash('error', 'Bạn không có quyền tạo tài khoản!');
    //     return;
    // }

    const emailExist = await User.findOne({
        email: req.body.email,
        deleted: false
    });

    if (emailExist) {
        req.flash('error', 'Email đã tồn tại!');
        res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/users`);

    } else {
        req.body.password = md5(req.body.password);

        const record = new User(req.body);
        await record.save();

        req.flash('success', 'Thêm mới thành công!');
        res.redirect(`${systemConfig.prefixAdmin}/users`);
    }
};

export const edit = async (req: Request, res: Response): Promise<void> => {
    // const permission: string[] = res.locals.role.permissions;
    // if (!permission.includes("users_edit")) {
    //     req.flash('error', 'Bạn không có quyền cập nhật tài khoản!');
    //     return;
    // }

    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };

        const data = await User.findOne(find);

        res.render('admin/pages/users/edit', {
            title: 'Chỉnh sửa tài khoản',
            data: data
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/users`);
    }
};

export const editPatch = async (req: Request, res: Response): Promise<void> => {
    // const permission: string[] = res.locals.role.permissions;
    // if (!permission.includes("users_edit")) {
    //     req.flash('error', 'Bạn không có quyền cập nhật tài khoản!');
    //     return;
    // }

    try {
        const id: string = req.params.id;

        const emailExist = await User.findOne({
            _id: { $ne: id },
            email: req.body.email,
            deleted: false
        });

        if (emailExist) {
            req.flash('error', 'Email đã tồn tại!');

            res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/users`);
        } else {
            if (req.body.password) {
                req.body.password = md5(req.body.password);
            } else {
                delete req.body.password;
            }

            await User.updateOne({ _id: id }, req.body);
            req.flash('success', 'Cập nhật thành công!');
            res.redirect(`${systemConfig.prefixAdmin}/users`);
        }
    } catch (error) {
        console.log(error);
        req.flash('error', 'Cập nhật thất bại!');
        res.redirect(`${systemConfig.prefixAdmin}/users`);
    }
};

export const changeStatus = async (req: Request, res: Response): Promise<void> => {
    // const permission: string[] = res.locals.role.permissions;
    // if (!permission.includes("users_edit")) {
    //     req.flash('error', 'Bạn không có quyền cập nhật tài khoản!');
    //     return;
    // }

    const status: string = req.params.status;
    const id: string = req.params.id;

    await User.updateOne({ _id: id }, { status: status });

    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/users`);
};

export const deleteItem = async (req: Request, res: Response): Promise<void> => {
    // const permission: string[] = res.locals.role.permissions;
    // if (!permission.includes("users_delete")) {
    //     req.flash('error', 'Bạn không có quyền cập nhật tài khoản!');
    //     return;
    // }

    const id: string = req.params.id;

    await User.updateOne({ _id: id }, { deleted: true, deleteAt: new Date() });

    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.redirect(req.headers.referer || `${systemConfig.prefixAdmin}/users`);
};

export const detail = async (req: Request, res: Response): Promise<void> => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const record = await User.findOne(find).select('-password -token')

        res.render('admin/pages/users/detail', {
            title: 'Chi tiết tài khoản',
            record: record
        });
    } catch (error) {
        console.log(error)
        res.redirect(`${systemConfig.prefixAdmin}/users`);
    }
}