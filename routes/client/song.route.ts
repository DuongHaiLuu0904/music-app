import { Router, Request, Response, NextFunction } from 'express';
const router: Router = Router();

import * as controller from '../../controllers/client/song.controller';


router.get('/:slugTopic', controller.list);

router.get('/detail/:slugSong', controller.detail);

router.patch('/like/:typeLike/:idSong', controller.likeYes);

router.patch('/favorite/:typeFavorite/:idSong', controller.favoriteYes);

export const songRouter: Router = router;