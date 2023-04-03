export const findCafeInfoResult = async(connection, [cafeId]) => {
    const findCafeInfoQuery = `SELECT id, name, address, number FROM CafeInfo WHERE id=?;`;
    const [cafeInfoResult] = await connection.query(findCafeInfoQuery, [cafeId]);

    return cafeInfoResult

}

export const createNewReviewResult = async(connection, [cafeId,userId,reviewRating,reviewBody]) => {
    const createNewReviewQuery = `INSERT INTO reviewInfo (cafe_id, writer_id, rating, reviewContent) VALUES(?,?,?,?);`;
    const [newReviewResult]  = await connection.query(createNewReviewQuery, [cafeId,userId,reviewRating,reviewBody]);

    return newReviewResult;
}

export const selectUserReivew = async(connection, [cafeId]) => {
    const selectUserReviewQuery = `SELECT writer_id, rating, reviewContent FROM reviewInfo WHERE cafe_id=?;`;
    const [reviewInfoResult] = await connection.query(selectUserReviewQuery, [cafeId]);

    return reviewInfoResult;
}