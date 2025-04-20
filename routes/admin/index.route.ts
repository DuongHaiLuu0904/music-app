import { Express } from 'express'

import { dashboardRouter } from './dashboard.route'
import { systemConfig } from '../../config/configAdmin'
import { topicRouter } from './topic.route'
import { songRouter } from './song.route'
import { singerRouter } from './singer.route'
import { accountRouter } from './account.route'
import { roleRouter } from './role.route'



const AdminRoutes = (app: Express): void => {
    const PATH_ADMIN = `${systemConfig.prefixAdmin}`

    app.use(`${PATH_ADMIN}/dashboard`, dashboardRouter)

    app.use(`${PATH_ADMIN}/topics`, topicRouter)

    app.use(`${PATH_ADMIN}/songs`, songRouter)
    
    app.use(`${PATH_ADMIN}/singers`, singerRouter)

    app.use(`${PATH_ADMIN}/accounts`, accountRouter)

    app.use(`${PATH_ADMIN}/roles`, roleRouter)
}

export default AdminRoutes