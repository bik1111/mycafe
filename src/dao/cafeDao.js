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
    const getUserInfoQuery = `SELECT username FROM UserInfo WHERE =?;`;
    const [getUserInfoRow] = await connection.query(
        getUserInfoQuery, [username]
    );

    return getUserInfoRow;
}