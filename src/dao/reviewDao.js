export const findCafeInfoResult = async(connection, [cafeId]) => {
    const findCafeInfoQuery = `SELECT id, name, address, number FROM CafeInfo WHERE id=?;`;
    const [cafeInfoResult] = await connection.query(findCafeInfoQuery, [cafeId]);

    return cafeInfoResult

}