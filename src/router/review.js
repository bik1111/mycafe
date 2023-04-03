import express from "express";
import { getReivewPage, postReview } from "../controller/reviewController.js";
const reviewRouter = express.Router();

reviewRouter.route('/:cafeId').get(getReivewPage);
reviewRouter.route('/post/:cafeId').post(postReview)


export default reviewRouter