import { Router } from 'express';
const router: Router = Router();

import multer from 'multer';
const upload = multer()

import * as controller from '../../controllers/admin/account.controller';

import * as uploadCloud from '../../middlewares/admin/uploadCloud.middleware';

import * as validate from '../../validates/admin/account.validate';


router.get('/', controller.index);

router.patch('/change-status/:status/:id', controller.changeStatus)

router.get('/create', controller.create)

router.post('/create', upload.single('avatar'), uploadCloud.uploadSingle, validate.createPost, controller.createPost)

router.get('/edit/:id', controller.edit)

router.patch('/edit/:id', upload.single('avatar'), uploadCloud.uploadSingle, validate.createPatch, controller.editPatch)

router.delete("/delete/:id", controller.deleteItem)

router.get('/detail/:id', controller.detail)

export const accountRouter: Router = router;