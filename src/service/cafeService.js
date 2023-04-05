import pool from '../config/database.js';
import { insertCafeInfoDao, findCafeInfo, findUserInfo, createNewUser, 
    findAddedCafe, 
    insertMyFavCafe, 
    selectMyFavCafeId, 
    selectUserFavCafe, 
    deleteMyFavCafeInList, 
    updateUserNameInfo,
    updateUserPasswordInfo,
     } from '../dao/cafeDao.js';



export const insertCafeInfo = async(myName,myLat,myLng,myAddress,myNumber) => {
    const insertCafeInfoParams = [ 
        myName, 
        myLat, 
        myLng, 
        myAddress,
        myNumber];

    const connection = await pool.getConnection(async (conn) => conn);
    const CafeInfoResult = await insertCafeInfoDao(connection, 
        insertCafeInfoParams)
    connection.release();

    return CafeInfoResult;


}


export const findCafe = async(keyword) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const searchCafeRes = await findCafeInfo(connection, keyword);
    connection.release();

    return searchCafeRes;

}


export const findUser = async(username) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const searchUser = await findUserInfo(connection, username);
    connection.release();

    return searchUser ;

}

export const registerUser = async(username,email,hashedPassword) => {
    const insertUserInfoParams = [username,email,hashedPassword];

    const connection = await pool.getConnection(async (conn) => conn);
    const newUser = await createNewUser(connection, insertUserInfoParams);
    connection.release();

    return newUser;


}

export const addedCafe = async(name) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const cafe = await findAddedCafe(connection, name);
    connection.release();

    return cafe;


}


export const insertFavCafe = async (cafeId,userId) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const favCafe = await insertMyFavCafe(connection, cafeId,userId);
    connection.release();

    return favCafe;
}

export const getCafeById = async(id) => {
    const connection = await pool.getConnection(async (conn) => conn);
    const favCafeInfo = await selectMyFavCafeId(connection, id);
    connection.release();

    return favCafeInfo;
}


export const findFavCafes = async(userId) => {
    const connection = await pool.getConnection(async(conn) => conn);
    const favCafes = await selectUserFavCafe(connection, userId);
    connection.release();

    return favCafes;

}

export const deletedCafe = async(user_id, cafe_id) => {
    const connection = await pool.getConnection(async(conn) => conn);
    const deletedCafe = await deleteMyFavCafeInList(connection, [user_id, cafe_id]);
    connection.release();

    return deletedCafe;
}


export const editUserNameResult = async(newUsername, oldUsername) => {
    const connection = await pool.getConnection(async(conn) => conn);
    const editedUser = await updateUserNameInfo(connection, [newUsername, oldUsername]);
    connection.release();

    return editedUser;
}


export const editUserPassword = async(hasedNewPassword, username) => {
    const connection = await pool.getConnection(async(conn) => conn);
    const editedUser = await updateUserPasswordInfo(connection, [hasedNewPassword, username]);
    connection.release();

    return editedUser;
}

