import express from "express";
import { getReivewPage } from "../controller/reviewController.js";
const reviewRouter = express.Router();

reviewRouter.route('/:cafeId').get(getReivewPage);

export default reviewRouter