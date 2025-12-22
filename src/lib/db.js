import mysql from 'mysql2/promise';

let cachedPool;

export async function getDB() {
    if (cachedPool) return cachedPool;

    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        waitForConnections: true,
        connectionLimit: 3,
        queueLimit: 0,
        ssl: { rejectUnauthorized: false }
    });

    cachedPool = pool;
    return pool;
}