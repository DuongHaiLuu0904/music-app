import express, {Express} from 'express';
import dotenv from 'dotenv'
import * as database from './config/database'; 
import clientRoutes from './routes/client/index.route';
import AdminRoutes from './routes/admin/index.route';
import moment from 'moment';
import { systemConfig } from './config/configAdmin';
import path from 'path'
import cors from 'cors'
import flash from 'express-flash';
import cookieParser from 'cookie-parser';
import session from 'express-session';

dotenv.config()
database.connect()

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// parse application
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// TinyMCE
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.use(express.static(`${__dirname}/public`))

app.set('view engine', 'pug')
app.set('views', './views')

// Flash
app.use(cookieParser('IamHaiLuu')); // key ramdom
app.use(session({
    secret: 'IamHaiLuu',       // Chuỗi bí mật để mã hóa session (nên đặt trong biến môi trường)
    resave: false,             // Không lưu session nếu không có thay đổi
    saveUninitialized: false,  // Không lưu session mới nếu chưa có dữ liệu
    cookie: { maxAge: 60000 }  // Thời gian sống của session (60 giây)
}))
app.use(flash());

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// app local variables
app.locals.moment = moment
app.locals.prefixAdmin = systemConfig.prefixAdmin

clientRoutes(app)
AdminRoutes(app)

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})