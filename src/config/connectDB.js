import mysql from 'mysql2/promise';
import env from 'dotenv';
env.config();
const pool = mysql.createPool({
    host: process.env.DBHOST,
    user: process.env.DBUSER,
    database: process.env.DBDATABASE,
    password: process.env.DBPASSWORD,
    port: process.env.DBPORT
});

// const pool = mysql.createPool({
//     host: 'containers-us-west-27.railway.app',
//     user: 'root',
//     database: 'railway',
//     password: '6zH7IT2CUzxWEkUWAnL0',
//     port: '7203'
// });

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'dataCantin'
// });

export default pool;