import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import cafeRouter  from "./src/router/cafe.js";
import morgan from 'morgan';
import path from 'path'
import ejsMate from "ejs-mate";



const app = express();
const logger = morgan("dev");


app.use('/', cafeRouter);
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', process.cwd() + '/src/views');

app.use(logger);



const PORT = 3000;
const handleListening = () =>
  console.log(`✅ Server listenting on http://localhost:${PORT} 🚀`);

app.listen(PORT, handleListening);


export default app;