import pool from '../config/database.js';
import { findCafeInfoResult } from '../dao/reviewDao.js';

export const findCafeInfobyId = async(cafeId) => {
    const connection = await pool.getConnection(async(conn) => conn);
    const findCafe = await findCafeInfoResult(connection, [cafeId]);
    connection.release();
    
    return findCafe;
}