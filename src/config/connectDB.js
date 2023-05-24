import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.DBPORT
});

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'dataCantin'
// });

export default pool;