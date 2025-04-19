import { Router } from 'express';
const router: Router = Router();

import multer from 'multer';
const upload = multer()

import * as controller from '../../controllers/admin/song.controller';

import * as uploadCloud from '../../middlewares/admin/uploadCloud.middleware';

router.get('/', controller.index);

router.get('/detail/:id', controller.detail)

router.get('/create', controller.create)

router.post(
    '/create',
    upload.fields([
        { name: 'avatar', maxCount: 1 },
        { name: 'audio', maxCount: 1 }
    ]),
    uploadCloud.uploadFields,
    controller.createPost)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.patch('/change-multi', controller.changeMultiple)

router.patch('/edit/:id', controller.edit)

router.delete('/delete/:id', controller.deleteSong)

export const songRouter: Router = router;