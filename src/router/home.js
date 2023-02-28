import express from 'express';
import { home, login, loginPage} from '../controller/homeController.js'

const homeRouter = express.Router();


homeRouter.route('/home').get(home)
homeRouter.route('/login').get(loginPage).post(login)

export default homeRouter;