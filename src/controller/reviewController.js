
import { findCafeInfobyId } from '../service/reviewService.js';

export const getReivewPage = async (req,res) => {
    const cafeId = req.params.cafeId;
    let cafeInfo = await findCafeInfobyId(cafeId);
    cafeInfo = cafeInfo[0]

    res.render('review', { cafeInfo })
}




