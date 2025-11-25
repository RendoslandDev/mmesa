// models/Software.js
import { query } from '../config/database.js';

class Software {
    static async findById(softwareId) {
        const rows = await query(
            `SELECT *
             FROM software
             WHERE id = $1`,
            [softwareId]
        );
        return rows[0] || null;
    }

    static async findByName(name) {
        const rows = await query(
            `SELECT *
             FROM software
             WHERE name = $1`,
            [name]
        );
        return rows[0] || null;
    }

    static async getAll() {
        const rows = await query(
            `SELECT *
             FROM software
             ORDER BY name ASC`
        );
        return rows;
    }

    static async getPopularity(limit = 10) {
        const rows = await query(
            `SELECT s.id AS software_id, s.name AS software_name,
                    COUNT(sss.id) AS selection_count
             FROM software s
             LEFT JOIN student_software_selections sss
               ON s.id = sss.software_id
             GROUP BY s.id, s.name
             ORDER BY selection_count DESC
             LIMIT $1`,
            [limit]
        );
        return rows;
    }

    static async getSelectionCount(softwareId) {
        const rows = await query(
            `SELECT COUNT(*) AS count
             FROM student_software_selections
             WHERE software_id = $1`,
            [softwareId]
        );
        return rows[0].count;
    }
}

export default Software;
