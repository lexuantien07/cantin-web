import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'containers-us-west-27.railway.app',
    user: 'root',
    database: 'railway',
    password: '6zH7IT2CUzxWEkUWAnL0',
    port: '7203'
});

export default pool;