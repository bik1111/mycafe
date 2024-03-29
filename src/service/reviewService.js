import pool from '../config/database.js';
import { findCafeInfoResult, createNewReviewResult,selectUserReivew, deleteUserReview} from '../dao/reviewDao.js';

export const findCafeInfobyId = async(cafeId) => {
    const connection = await pool.getConnection(async(conn) => conn);
    const findCafe = await findCafeInfoResult(connection, [cafeId]);
    connection.release();
    
    return findCafe;
}

export const createNewReview = async(cafeId,userId,reviewRating,reviewBody) => {
    const connection = await pool.getConnection(async(conn) => conn);
    const myReview = await createNewReviewResult(connection, [cafeId,userId,reviewRating,reviewBody]);
    connection.release();

    return myReview;
}


export const findUserReview = async(cafeId) => {
    const connection = await pool.getConnection(async(conn) => conn);
    const userReview = await selectUserReivew(connection, [cafeId])
    connection.release();

    return userReview;
    
}

export const deleteCafeReview = async(cafeId,reviewId) => {
    const connection = await pool.getConnection(async(conn) => conn);
    const deletedReview = await deleteUserReview(connection, [cafeId,reviewId]);
    connection.release();

    return deletedReview;
}