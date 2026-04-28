import mysql from 'mysql2/promise' ;
import 'dotenv/config'
const pool = mysql.createPool({
    host: process.env.HOST.trim(),
    user: process.env.USER.trim(),
    password: process.env.PASSWORD, // Usually empty for root/localhost
    database: process.env.DATABASE.trim(),
    multipleStatements: process.env.MULTISTATMENTS === 'true'
});
export default pool;