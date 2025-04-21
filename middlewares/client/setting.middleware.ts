import { Request, Response, NextFunction } from 'express'

import SettingGeneral from '../../models/setting-general.model'

export const infoSetting = async (req: Request, res: Response, next: NextFunction) => {
    const setting = await SettingGeneral.findOne({})

    res.locals.setting = setting
    next()
}