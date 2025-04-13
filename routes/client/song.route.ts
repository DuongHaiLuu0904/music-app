import { Router, Request, Response, NextFunction } from 'express';
const router: Router = Router();

import * as controller from '../../controllers/client/song.controller';


router.get('/:slugTopic', controller.list);

export const songRouter: Router = router;