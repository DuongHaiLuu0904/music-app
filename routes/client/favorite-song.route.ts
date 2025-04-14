import { Router, Request, Response, NextFunction } from 'express';
const router: Router = Router();

import * as controller from '../../controllers/client/favorite-song.controller';


router.get('/', controller.index);


export const favoriteSongRouter: Router = router;