import pool from '../config/database.js';
import { insertCafeInfoDao } from '../dao/cafeDao.js';



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