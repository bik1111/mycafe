import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cafeRouter  from "./src/router/cafe.js";
import homeRouter from "./src/router/home.js";
import reviewRouter from './src/router/review.js';
import morgan from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import ejsMate from "ejs-mate";
import session from 'express-session';
import flash from "connect-flash";
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import localsMiddleware from './middleware.js';
import MySQLStore from 'express-mysql-session';
const MySQLStoreSession = MySQLStore(session);


const app = express();



var options ={      
  host: '127.0.0.1',
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
};
 


var sessionStore = new MySQLStoreSession(options);
app.use(cookieParser());
app.use(session ({
  name: 'session',
  secret: 'thisshouldbeabettersecret!',
  resave: false,
  saveUninitialized : false,
  touchAfter: 24 * 60 * 60,
  store :sessionStore,
  cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7
  }

}))
app.use(flash());
app.use(localsMiddleware);



app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.set('views', path.join(__dirname, 'src/views'))
app.use(express.static(__dirname + '/src/public'));


const logger = morgan("dev");


app.use('/review', reviewRouter);
app.use('/cafe', cafeRouter);
app.use('/', homeRouter);




app.use(logger);




const PORT = 3000;
const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);


export default app;
