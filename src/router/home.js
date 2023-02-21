import express from 'express';
import { home } from '../controller/homeController.js'

const homeRouter = express.Router();


homeRouter.route('/home').get(home)