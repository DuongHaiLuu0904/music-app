import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv'
import * as database from './config/database'; 
import clientRoutes from './routes/client/index.route';
import moment from 'moment';
// import cors from 'cors'

dotenv.config()
database.connect()

const app: Express = express();
const port: number | string = process.env.PORT || 3000

app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', './views')


// app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app local variables
app.locals.moment = moment

clientRoutes(app)


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})