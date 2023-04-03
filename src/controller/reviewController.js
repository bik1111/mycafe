
import jwt from "jsonwebtoken";

import { findCafeInfobyId, createNewReview, findUserReview } from '../service/reviewService.js';

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
try {
    const { reviewBody, reviewRating } = req.body;

    const jwtToken = req.headers.cookie
    .split(';')
    .find(cookie => cookie.trim().startsWith('jwt='))
    .split('=')[1];

    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);
    const userId = decoded.id;

    const cafeId = req.params.cafeId;
    const newReview = createNewReview(cafeId,userId,reviewRating,reviewBody);
    
    req.flash('success', 'Created new review!');
    res.redirect(`/review/${cafeId}`);


} catch (err)  {
    console.log(err);
}
}


