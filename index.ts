import express, {Express, Request, Response} from 'express';
import dotenv from 'dotenv'
import * as database from './config/database'; 
import clientRoutes from './routes/client/index.route';
// import cors from 'cors'

dotenv.config()
database.connect()

const app: Express = express();
const port: number | string = process.env.PORT || 3000

app.set('view engine', 'pug')
app.set('views', './views')


// app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

clientRoutes(app)

app.get('/', )

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})