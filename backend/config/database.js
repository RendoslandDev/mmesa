// config/database.js
import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'mmesa_survey',
    max: 20,              // max number of clients in the pool
    idleTimeoutMillis: 30000,  // close idle clients after 30s
    connectionTimeoutMillis: 2000 // return an error after 2s if connection could not be established
});

// Simple helper function for queries
export async function query(text, params) {
    const client = await pool.connect();
    try {
        const res = await client.query(text, params);
        return res.rows;
    } finally {
        client.release();
    }
}

// Test the connection
pool.connect()
    .then(client => {
        console.log('✅ PostgreSQL connected successfully');
        client.release();
    })
    .catch(err => {
        console.error('❌ PostgreSQL connection error:', err.stack);
    });
