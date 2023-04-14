import express from "express";
import { getReivewPage, postReview, deleteReview} from "../controller/reviewController.js";
import { authJWT } from "../utils/auth.js";

const reviewRouter = express.Router();

reviewRouter.route('/:cafeId').get(getReivewPage);
reviewRouter.route('/post/:cafeId').post(postReview)
reviewRouter.route('/delete/:cafeId/:reviewId').delete(deleteReview);

export default reviewRouter