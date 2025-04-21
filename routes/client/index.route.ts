import { Express } from 'express'

import { homeRouter } from './home.route'
import { topicRouter } from './topic.route'
import { songRouter } from './song.route'
import { favoriteSongRouter } from './favorite-song.route'
import { searchRouter } from './search.route'
import { userRouter } from './user.route'

import { infoUser } from '../../middlewares/client/user.middleware'
import { infoSetting } from '../../middlewares/client/setting.middleware'

const clientRoutes = (app: Express): void => {
    app.use(infoUser)

    app.use(infoSetting)

    app.use('/', homeRouter)
    
    app.use('/topics', topicRouter)

    app.use('/songs', songRouter)

    app.use('/favorite-songs', favoriteSongRouter)
    
    app.use('/search', searchRouter)

    app.use('/users', userRouter)
}

export default clientRoutes