
import jwt from "jsonwebtoken";

import { findCafeInfobyId, createNewReview, findUserReview , deleteCafeReview} from '../service/reviewService.js';
import { databaseResponseTimeHistogram } from "../utils/monitor.js";

export const getReivewPage = async (req,res) => {
    const jwtToken = req.headers.cookie
    .split(';')
    .find(cookie => cookie.trim().startsWith('jwt='))
    .split('=')[1];

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const userId = decoded.id;

    const cafeId = req.params.cafeId;
    let cafeInfo = await findCafeInfobyId(cafeId);
    cafeInfo = cafeInfo[0]

    let reviews = await findUserReview(cafeId);
    

    res.render('review', { cafeInfo, cafeId, reviews, userId})
}


export const postReview = async(req,res) => {

const timer = databaseResponseTimeHistogram.startTimer()
    
const metricsLabels = {
    operation: 'createReview'
}

try {
    const { reviewBody, reviewRating } = req.body;

    const jwtToken = req.headers.cookie
    .split(';')
    .find(cookie => cookie.trim().startsWith('jwt='))
    .split('=')[1];

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const userId = decoded.id;

    const cafeId = req.params.cafeId;


    const newReview = await createNewReview(cafeId,userId,reviewRating,reviewBody);

    timer({...metricsLabels, success: true});


    res.redirect(`/review/${cafeId}`);


} catch (err)  {
    timer({...metricsLabels, success: false});
    console.log(err);
}
}


export const deleteReview = async(req,res) => {

try {

    const { cafeId, reviewId }  = req.params;
    const deletedReivew = await deleteCafeReview(cafeId,reviewId);

    res.redirect(`/review/${cafeId}`);

} catch(err) {
    console.log(err);
}

}
