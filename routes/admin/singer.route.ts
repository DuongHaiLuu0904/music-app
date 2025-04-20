import { Router } from 'express';
const router: Router = Router();

import multer from 'multer';
const upload = multer()

import * as controller from '../../controllers/admin/singer.controller';

import * as uploadCloud from '../../middlewares/admin/uploadCloud.middleware';

router.get('/', controller.index);

// router.get('/detail/:id', controller.detail)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.patch('/change-multi', controller.changeMultiple)

router.get('/create', controller.create)

router.post('/create', upload.single('avatar'), uploadCloud.uploadSingle, controller.createPost)

// router.patch('/edit/:id', controller.edit)

router.delete('/delete/:id', controller.deleteTopic)

export const singerRouter: Router = router;