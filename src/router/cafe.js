import "dotenv/config";
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { starBucks, getCafe, findCoffeeShop, addMyCafe, addMyCafePage, deleteMyFavCafe } from '../controller/cafeController.js';


const cafeRouter = express.Router();

cafeRouter.route('/starbucks').get(starBucks);
cafeRouter.route('/info/:page').get(getCafe);
cafeRouter.route('/search').get(findCoffeeShop);
cafeRouter.route('/add').post(addMyCafe);
cafeRouter.route('/myFavCafe/:userId').get(addMyCafePage);
cafeRouter.route('/myFavCafe/:userId/:cafeId').delete(deleteMyFavCafe);

export default cafeRouter;