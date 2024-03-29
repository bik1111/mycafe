import express from 'express';
import bodyParser from 'body-parser';

import { home, login, loginPage, register, 
    registerPage, logout, 
    editUserNamePage, editUserName,
    editPasswordPage,  editPassword, 
    emailAuth, emailLinkauth, verifyEmailAndToken, sendOk } from '../controller/homeController.js'

const homeRouter = express.Router();

homeRouter.use(bodyParser.urlencoded({ extended: true }));

homeRouter.route('/').get(sendOk)
homeRouter.route('/home').get(home)
homeRouter.route('/login').get(loginPage).post(login)
homeRouter.route('/register').get(registerPage).post(register)
homeRouter.route('/authemail').post(emailAuth)
homeRouter.route('/verify-email').post(emailLinkauth)
homeRouter.route('/verify-email').get(verifyEmailAndToken)
homeRouter.route('/edit/username').get(editUserNamePage).post(editUserName)
homeRouter.route('/edit/password').get(editPasswordPage).post(editPassword)
homeRouter.route('/logout').get(logout)

export default homeRouter;