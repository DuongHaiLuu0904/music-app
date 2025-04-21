import { Request, Response } from 'express';
import Setting from '../../models/setting-general.model';

export const general = async (req: Request, res: Response): Promise<void> => {
    const setting = await Setting.findOne({});

    res.render('admin/pages/setting/index', {
        title: 'Trang cài đặt',
        setting: setting,
    });
}

export const generalPatch = async (req: Request, res: Response): Promise<void> => {
    const setting = await Setting.findOne({});

    if (setting) {
        await Setting.updateOne({ _id: setting.id }, req.body);
    } else {
        const record = new Setting(req.body);
        await record.save();
    }

    req.flash('success', 'Cập nhật thành công');
    res.redirect(req.headers.referer || '/');
}