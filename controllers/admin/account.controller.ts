import { Request, Response } from 'express'
import { systemConfig } from '../../config/configAdmin' 
import md5 from 'md5'
import { Types } from 'mongoose'

import Account from '../../models/account.model'
import Role from '../../models/role.model'


interface IAccount {
    _id: Types.ObjectId;
    role_id: Types.ObjectId;
    role?: IRole;
    deleted: boolean;
    password?: string;
    token?: string;
}

interface IRole {
    _id: Types.ObjectId;
    title: string;
    deleted: boolean;
}

// [GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    }

    const records: IAccount[] = await Account.find(find).select('-password -token')

    for (const record of records) {
        const role: IRole | null = await Role.findOne({
            _id: record.role_id,
            deleted: false
        })
        record.role = role || undefined
    }

    res.render('admin/pages/accounts/index', {
        title: 'Tài khoản',
        records: records,
    })
}

// [PATCH] /admin/songs/change-status/:status/:id
export const changeStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const id: string = req.params.id
        const status: string = req.params.status

        await Account.updateOne({ _id: id }, { status: status })
        req.flash('success', 'Cập nhật trạng thái thành công!');
        res.json({
            code: 200,
            message: 'Update status success',
        })
    }
    catch (error) {
        res.json({
            code: 400,
            message: 'Error'
        })
    }
}

// [GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    }

    const recordRole = await Role.find(find)

    res.render('admin/pages/accounts/create', {
        title: 'Thêm nhóm quyền',
        recordRole: recordRole
    });
}

// [POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
    const emmailExist = await Account.findOne({
        email: req.body.email,
        deleted: false 
    })

    if (emmailExist) {
        req.flash('error', 'Email đã tồn tại!');

        res.redirect(req.headers.referer || '/');
    } else {
        req.body.password = md5(req.body.password)

        const record = new Account(req.body)
        record.save()

        req.flash('success', 'Thêm mới thành công!');
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

// [GET] /admin/accounts/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const data = await Account.findOne(find)

        const roles = await Role.find({ deleted: false })
    
        res.render('admin/pages/accounts/edit', {
            title: 'Chỉnh sửa tài khoản',
            data: data,
            roles: roles
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

// [PATCH] /admin/accounts/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    try {
        const id = req.params.id

        const emailExist = await Account.findOne({
            _id: { $ne: id },
            email: req.body.email,
            deleted: false 
        })
    
        if (emailExist) {
            req.flash('error', 'Email đã tồn tại!');
    
            const backURL = req.get("Referrer") || "/";
            return res.redirect(backURL)
        } else {
            if(req.body.password) {
                req.body.password = md5(req.body.password)
            } else {
                delete req.body.password
            }

            await Account.updateOne({ _id: id }, req.body)
            req.flash('success', 'Cập nhật thành công!');
            res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }
    } catch (error) {
        console.log(error)
        req.flash('error', 'Cập nhật thất bại!');
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}

// [DELETE] /admin/accounts/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
    
        await Account.updateOne({ _id: id }, {
            deleted: true,
            deleteAt: new Date()
        })

        req.flash('success', 'Cập nhật trạng thái thành công!');
        res.json({
            code: 200,
            message: 'Delete success',
        })
    }
    catch (error) {
        req.flash('error', 'Cập nhật trạng thái thất bại!');
        res.json({
            code: 400,
            message: 'Error'
        })
    }
}

// [GET] /admin/accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
    try {
        const find = {
            deleted: false,
            _id: new Types.ObjectId(req.params.id)
        }
        const record = await Account.findOne(find).select('-password -token').lean()

        if (!record) {
            req.flash('error', 'Không tìm thấy tài khoản!');
            return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }

        if (!record.role_id) {
            req.flash('error', 'Tài khoản không có role_id!');
            return res.redirect(`${systemConfig.prefixAdmin}/accounts`);
        }

        const role = await Role.findOne({
            _id: new Types.ObjectId(record.role_id.toString()),
            deleted: false
        }).lean()
        
        const accountWithRole = {
            ...record,
            _id: new Types.ObjectId(record._id.toString()),
            role_id: new Types.ObjectId(record.role_id.toString()),
            role: role || undefined
        } as IAccount

        res.render('admin/pages/accounts/detail', {
            title: 'Chi tiết tài khoản',
            record: accountWithRole
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}