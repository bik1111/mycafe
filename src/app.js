import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cafeRouter from "./router/cafe.js";
import homeRouter from "./router/home.js";
import reviewRouter from './router/review.js';
import morgan from 'morgan';
import path from 'path';
import compression from "compression";
import bodyParser from 'body-parser';
import ejsMate from "ejs-mate";
import session from 'express-session';
import flash from "connect-flash";
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import localsMiddleware from './middleware.js';
import MySQLStore from 'express-mysql-session';
import { restResponseTimeHistogram, startMetricServer } from './utils/monitor.js';
import responseTime from 'response-time';

const MySQLStoreSession = MySQLStore(session);

const app = express();



app.use(flash());
//app.use(localsMiddleware);
app.use(compression())
app.use(responseTime((req, res, time) => {
  if (req?.route?.path) {
    restResponseTimeHistogram.observe({
      method: req.method,
      route: req.route.path,
      status_code: res.statusCode
    }, time * 1000)
  }
}))


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.set('views', path.join(__dirname, '/views'))
app.use(express.static(__dirname + '/public'));


const logger = morgan("dev");


app.use('/review', reviewRouter);
app.use('/cafe', cafeRouter);
app.use('/', homeRouter);



app.use(logger);



const PORT = 3001;


const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);
startMetricServer();


export default app;