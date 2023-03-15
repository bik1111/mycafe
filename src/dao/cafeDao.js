
export const insertCafeInfoDao = async(connection, insertCafeInfoParams) => {

    const insertCafeInfoQuery = `INSERT INTO CafeInfo (name, lat, lng, address, number) VALUES (?,?,?,?,?);`;
    const [insertCafeInfoRow] = await connection.query(
        insertCafeInfoQuery,
        insertCafeInfoParams
    );

    return insertCafeInfoRow;
}


export const findCafeInfo = async(connection, keyword) => {
    const getCafeInfoQuery = `SELECT name, address, number FROM CafeInfo WHERE CONCAT(name, address, number) LIKE '%${keyword}%';`;
    const [getCafeInfoRow] = await connection.query(
        getCafeInfoQuery, [keyword]
    );

    return getCafeInfoRow;
}

export const findUserInfo = async(connection, username) => {
    const getUserInfoQuery = `SELECT id, password, username FROM UserInfo WHERE username=?;`;
    const [getUserInfoRow] = await connection.query(
        getUserInfoQuery, [username]
    );

    return getUserInfoRow;
}

export const createNewUser = async(connection, insertUserInfoParams) => {
    const insertNewUserQuery = `INSERT INTO UserInfo (username, email, password) VALUES (?,?,?);`;
    const [insertUserInfoRow] = await connection.query(
        insertNewUserQuery,
        insertUserInfoParams
    );

    return insertUserInfoRow;
}


export const findAddedCafe = async(connection, name) => {
    const selectAddedCafe = `SELECT id,name,address,number FROM CafeInfo WHERE name=?;`;
    
    const [getCafeInfoRow] = await connection.query(
        selectAddedCafe, [name]);
    return getCafeInfoRow;

}

export const insertMyFavCafe = async(connection, cafeId,userId) => {
    const insertFavCafeInfoQuery = `INSERT INTO favCafeInfo (cafe_id, user_id) VALUES(?,?);`;
    const [insertFavCafeInfoRow] = await connection.query(
        insertFavCafeInfoQuery,
        [cafeId,userId]
    );
    
    return insertFavCafeInfoRow;

}


export const selectMyFavCafeId = async(connection, id) => {
    const selectFavCafeInfoQuery = `SELECT name, address, number FROM CafeInfo WHERE id=?;`;
    const [getFavCafeInfoRow] = await connection.query(
        selectFavCafeInfoQuery, [id]);

    return getFavCafeInfoRow;
}

export const selectUserFavCafe = async(connection, userId) => {
    const selectFavUserCafeInfoQuery =`
    SELECT CafeInfo.id, CafeInfo.name, CafeInfo.address, CafeInfo.number
    FROM favCafeInfo 
    JOIN UserInfo ON favCafeInfo.user_id = UserInfo.id 
    JOIN CafeInfo ON favCafeInfo.cafe_id = CafeInfo.id 
    WHERE UserInfo.id=?;`;

    const [getFavUserCafeInfoRow] = await connection.query(selectFavUserCafeInfoQuery, [userId]);

    return getFavUserCafeInfoRow;
}

export const deleteMyFavCafeInList = async(connection, [user_id,cafe_id]) => {
    const deleteFavCafeInfoQuery = `DELETE FROM favCafeInfo WHERE user_id=? AND cafe_id=?;`;

    const [deleteFavCafeInfoRow] = await connection.query(deleteFavCafeInfoQuery, [user_id, cafe_id]);

    return deleteFavCafeInfoRow;
}