import "dotenv/config";
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { starBucks, getCafe } from '../controller/cafeController.js';


const cafeRouter = express.Router();

cafeRouter.route('/starbucks').get(starBucks)
cafeRouter.route('/cafe').get(getCafe)


export default cafeRouter;