// utils/validationHelpers.js
import { pool } from '../config/database.js';

export async function getValidModuleIds(selectedModuleIds) {
    if (!selectedModuleIds || !selectedModuleIds.length) return [];

    const placeholders = selectedModuleIds.map((_, i) => `$${i + 1}`).join(',');
    const queryText = `SELECT id FROM modules WHERE id IN (${placeholders})`;

    const result = await pool.query(queryText, selectedModuleIds);
    return result.rows.map(r => r.id);
}

export async function getValidSoftwareIds(selectedSoftwareIds) {
    if (!selectedSoftwareIds || !selectedSoftwareIds.length) return [];

    const placeholders = selectedSoftwareIds.map((_, i) => `$${i + 1}`).join(',');
    const queryText = `SELECT id FROM software WHERE id IN (${placeholders})`;

    const result = await pool.query(queryText, selectedSoftwareIds);
    return result.rows.map(r => r.id);
}
