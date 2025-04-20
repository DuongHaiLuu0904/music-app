import { Request, Response } from 'express'

import { systemConfig } from '../../config/configAdmin'

import Role from '../../models/role.model'

// [GET] /admin/roles
export const index = async (req: Request, res: Response) => {
    let find = {
        deleted: false
    }

    const records = await Role.find(find)

    res.render('admin/pages/roles/index', {
        title: 'Trang phân quyền',
        records: records
    });
}

// [GET] /admin/roles/create
export const create = async (req: Request, res: Response) => {
    res.render('admin/pages/roles/create', {
        title: 'Tạo mới phân quyền'
    });
}

// [POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
    try {
        const record = new Role(req.body)
        record.save()

        req.flash('success', 'Thêm mới thành công!');
        res.redirect(req.headers.referer || '/');


    } catch (error) {
        req.flash('error', 'Thêm mới thất bại!');
        res.redirect(req.headers.referer || '/');
    }
}

// [GET] /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
    try {
        let find = {
            _id: req.params.id,
            deleted: false
        }

        const record = await Role.findOne(find)

        res.render('admin/pages/roles/edit', {
            title: 'Sửa nhóm quyền',
            record: record
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`)
    }
}

// [PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
    const id = req.params.id

    try {
        await Role.updateOne(
            { _id: id }, 
            req.body
        )
        req.flash('success', 'Cập nhật thành công!');
    } catch (error) {
        console.log(error)
        req.flash('error', 'Cập nhật thất bại!');
    }

    res.redirect(req.headers.referer || '/');
}

// [DELETE] /admin/roles/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
    const id = req.params.id

    try {
        await Role.updateOne(
            { _id: id }, 
            {
                deleted: true,
                deleteAt: new Date()
            }
        )
        req.flash('success', 'Xóa thành công!');
        res.json({
            code: 200,
            message: 'Delete success',
        })
    } catch (error) {
        console.log(error)
        req.flash('error', 'Xóa thất bại!');
        res.json({
            code: 400,
            message: 'Error'
        })
    }   
}

// [GET] /admin/roles/detail/:id
export const detail = async (req: Request, res: Response) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const record = await Role.findOne(find)

        res.render('admin/pages/roles/detail', {
            title: 'Chi tiết Quyền',
            record: record
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [GET] /admin/roles/permissions
export const permissions = async (req: Request, res: Response) => {
    try {
        let find = {
            deleted: false
        }
    
        const records = await Role.find(find)
    
        res.render('admin/pages/roles/permissions', {
            title: 'Phân quyền',
            records: records
        });
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
}

// [PATCH] /admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response) => {
    try {
        const permissions = JSON.parse(req.body.permission)

        for (const item of permissions) {
            await Role.updateOne({ _id: item.id }, { permissions: item.permissions })
        }
        req.flash('success', 'Cập nhật trạng thái thành công!');

        res.redirect(req.headers.referer || '/');
    } catch (error) {
        req.flash('error', 'Cập nhật thất bại!');
    }
}
