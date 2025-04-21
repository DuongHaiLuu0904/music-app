import { Express } from 'express'

import { dashboardRouter } from './dashboard.route'
import { systemConfig } from '../../config/configAdmin'
import { topicRouter } from './topic.route'
import { songRouter } from './song.route'
import { singerRouter } from './singer.route'
import { accountRouter } from './account.route'
import { roleRouter } from './role.route'
import { userRouter } from './user.route'
import { authRouter } from './auth.route'
import { settingRouter } from './setting.route'

import * as middleware from '../../middlewares/admin/auth.middleware'

const AdminRoutes = (app: Express): void => {
    const PATH_ADMIN = `${systemConfig.prefixAdmin}`

    app.use(`${PATH_ADMIN}/dashboard`, middleware.requireAuth, dashboardRouter)

    app.use(`${PATH_ADMIN}/topics`, middleware.requireAuth, topicRouter)

    app.use(`${PATH_ADMIN}/songs`, middleware.requireAuth, songRouter)
    
    app.use(`${PATH_ADMIN}/singers`, middleware.requireAuth, singerRouter)

    app.use(`${PATH_ADMIN}/accounts`, middleware.requireAuth, accountRouter)

    app.use(`${PATH_ADMIN}/roles`, middleware.requireAuth, roleRouter)

    app.use(`${PATH_ADMIN}/users`, middleware.requireAuth, userRouter)

    app.use(`${PATH_ADMIN}/auth`, authRouter)

    app.use(`${PATH_ADMIN}/settings`, middleware.requireAuth, settingRouter)
}

export default AdminRoutes