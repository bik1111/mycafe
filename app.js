import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cafeRouter  from "./src/router/cafe.js";
import homeRouter from "./src/router/home.js";
import morgan from 'morgan';
import path from 'path'
import ejsMate from "ejs-mate";



const app = express();
const logger = morgan("dev");


app.use('/cafe', cafeRouter);
app.use('/', homeRouter);
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.set('views', path.join(__dirname, 'src/views'))
app.use(express.static(__dirname + '/src/public'));


app.use(logger);



const PORT = 3000;
const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);


export default app;