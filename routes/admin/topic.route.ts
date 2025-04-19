import { Router } from 'express';
const router: Router = Router();

import * as controller from '../../controllers/admin/topic.controller';


router.get('/', controller.index);

// router.get('/detail/:id', controller.detail)

router.patch('/change-status/:status/:id', controller.changeStatus)

router.patch('/change-multi', controller.changeMultiple)

// router.post('/create', controller.create)

// router.patch('/edit/:id', controller.edit)

router.delete('/delete/:id', controller.deleteTopic)

export const topicRouter: Router = router;