import { query } from "express";

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

export const findUserInfo = async(connection, email) => {
    const getUserInfoQuery = `SELECT id, password, email, status FROM UserInfo WHERE email=?;`;
    const [getUserInfoRow] = await connection.query(
        getUserInfoQuery, [email]
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

export const updateUserNameInfo = async(connection, [newUsername, oldUsername]) => {
    const updateUserInfoQuery = `UPDATE UserInfo SET username =? WHERE username=?;`;
    const [updateUserInfoResult] = await connection.query(updateUserInfoQuery, [newUsername, oldUsername]);


    return updateUserInfoResult;

}

export const updateUserPasswordInfo = async(connection, [hasedNewPassword, username]) => {
    const updateUserPasswordInfoQuery = `UPDATE UserInfo SET password=? WHERE username=?;`;
    const [udpateUserInfoResult] = await connection.query(updateUserPasswordInfoQuery, [hasedNewPassword, username]);

    return udpateUserInfoResult;
}


export const insertTokenandEmail = async(connection, [token, email, password]) => {
    const insertEmailTokenQuery = `INSERT INTO UserInfo (token, email, password, status) VALUES (?,?,?,0);`;
    const [insertEmailToken] = await connection.query(insertEmailTokenQuery, [token, email, password]);

    return insertEmailToken;
}


export const findVerifiedInfo = async(connection, token, email) => {
    const findVerifiedTokenAndEmailQuery = `SELECT token, email FROM UserInfo WHERE token =? AND email =?;`;
    const [findTokenAndEmail] = await connection.query(findVerifiedTokenAndEmailQuery, [token, email]);

    return findTokenAndEmail;
}


export const updateUserStatusInfo = async(connection, token, email) => {
    const updateUserStatusQuery = `UPDATE UserInfo SET status = 1 WHERE token = ? AND email=?;`;
    const [updateUserStatus] = await connection.query(updateUserStatusQuery, [token,email]);

    return updateUserStatus;
}