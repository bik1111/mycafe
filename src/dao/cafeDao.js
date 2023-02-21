export const insertCafeInfoDao = async(connection, insertCafeInfoParams) => {

    const insertCafeInfoQuery = `INSERT INTO CafeInfo (name, lat, lng, address, number) VALUES (?,?,?,?,?);`;
    const [insertCafeInfoRow] = await connection.query(
        insertCafeInfoQuery,
        insertCafeInfoParams
    );

    return insertCafeInfoRow;
}
