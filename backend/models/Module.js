// models/Module.js
import { query } from '../config/database.js';

class Module {
    static async findById(moduleId) {
        const rows = await query(
            `SELECT m.*, mc.name AS category_name
             FROM modules m
             JOIN module_categories mc
               ON m.category_id = mc.id
             WHERE m.id = $1`,
            [moduleId]
        );
        return rows[0] || null;
    }

    static async findByName(moduleName) {
        const rows = await query(
            `SELECT m.*, mc.name AS category_name
             FROM modules m
             JOIN module_categories mc
               ON m.category_id = mc.id
             WHERE m.name = $1`,
            [moduleName]
        );
        return rows[0] || null;
    }

    static async getAllByCategory(categoryId) {
        const rows = await query(
            `SELECT *
             FROM modules
             WHERE category_id = $1
             ORDER BY is_major DESC, name ASC`,
            [categoryId]
        );
        return rows;
    }

    static async getAllMajor() {
        const rows = await query(
            `SELECT *
             FROM modules
             WHERE is_major = TRUE
             ORDER BY name ASC`
        );
        return rows;
    }

    static async getAllSub() {
        const rows = await query(
            `SELECT *
             FROM modules
             WHERE is_major = FALSE
             ORDER BY name ASC`
        );
        return rows;
    }

    static async getAll() {
        const rows = await query(
            `SELECT m.*, mc.name AS category_name
             FROM modules m
             JOIN module_categories mc
               ON m.category_id = mc.id
             ORDER BY mc.name, m.is_major DESC, m.name`
        );
        return rows;
    }

    static async getPopularity(limit = 10) {
        const rows = await query(
            `SELECT 
                m.id AS module_id,
                m.name AS module_name,
                m.is_major,
                mc.name AS category_name,
                COUNT(sms.id) AS selection_count
             FROM modules m
             LEFT JOIN student_module_selections sms
               ON m.id = sms.module_id
             LEFT JOIN module_categories mc
               ON m.category_id = mc.id
             GROUP BY m.id, m.name, m.is_major, mc.name
             ORDER BY selection_count DESC
             LIMIT $1`,
            [limit]
        );
        return rows;
    }

    static async getSelectionCount(moduleId) {
        const rows = await query(
            `SELECT COUNT(*) AS count
             FROM student_module_selections
             WHERE module_id = $1`,
            [moduleId]
        );
        return rows[0].count;
    }
}

export default Module;
