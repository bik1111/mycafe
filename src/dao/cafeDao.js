import { connect } from "puppeteer";

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
    const getUserInfoQuery = `SELECT username, password FROM UserInfo WHERE username=?;`;
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