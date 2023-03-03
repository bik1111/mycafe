import express from 'express';
import bodyParser from 'body-parser';

import { home, login, loginPage, register, registerPage,  logout } from '../controller/homeController.js'

const homeRouter = express.Router();

homeRouter.use(bodyParser.urlencoded({ extended: true }));


homeRouter.route('/home').get(home)
homeRouter.route('/login').get(loginPage).post(login)
homeRouter.route('/register').get(registerPage).post(register)
homeRouter.route('/logout').get(logout)

export default homeRouter;