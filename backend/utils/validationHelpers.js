import { pool } from '../config/database.js';

/**
 * Fetch all valid module IDs from the database
 */
export async function getValidModuleIds() {
    const result = await pool.query('SELECT id FROM modules');
    return result.rows.map(r => r.id);
}

/**
 * Fetch all valid software IDs from the databasje
 */
export async function getValidSoftwareIds() {
    const result = await pool.query('SELECT id FROM software');
    return result.rows.map(r => r.id);
}
