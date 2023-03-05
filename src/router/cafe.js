import "dotenv/config";
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { starBucks, getCafe, findCoffeeShop, addMyCafe, addMyCafePage } from '../controller/cafeController.js';


const cafeRouter = express.Router();

cafeRouter.route('/starbucks').get(starBucks);
cafeRouter.route('/info/:page').get(getCafe);
cafeRouter.route('/search').get(findCoffeeShop);
cafeRouter.route('/add').post(addMyCafe);
cafeRouter.route('/myFavCafe/:userId').get(addMyCafePage);

export default cafeRouter;