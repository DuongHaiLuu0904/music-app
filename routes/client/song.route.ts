import { Router } from 'express';
const router: Router = Router();

import * as controller from '../../controllers/client/song.controller';


router.get('/:slugTopic', controller.list);

router.get('/detail/:slugSong', controller.detail);

router.patch('/like/:typeLike/:idSong', controller.likeYes);

router.patch('/favorite/:typeFavorite/:idSong', controller.favoriteYes);

router.patch('/listen/:idSong', controller.listen);

export const songRouter: Router = router;