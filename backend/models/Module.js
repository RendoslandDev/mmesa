import pool from '../config/database.js';
class Module {
    static async findById(moduleId) {
        const [rows] = await pool.execute(
            `SELECT m.*, mc.category_name 
             FROM modules m 
             JOIN module_categories mc 
             ON m.category_id = mc.category_id 
             WHERE m.module_id = ?`,
            [moduleId]
        );
        return rows[0] || null;
    }

    static async findByName(moduleName) {
        const [rows] = await pool.execute(
            `SELECT m.*, mc.category_name 
             FROM modules m 
             JOIN module_categories mc 
             ON m.category_id = mc.category_id 
             WHERE m.module_name = ?`,
            [moduleName]
        );
        return rows[0] || null;
    }

    static async getAllByCategory(categoryId) {
        const [rows] = await pool.execute(
            `SELECT * FROM modules 
             WHERE category_id = ? 
             ORDER BY is_major_module DESC, module_name ASC`,
            [categoryId]
        );
        return rows;
    }

    static async getAllMajor() {
        const [rows] = await pool.execute(
            `SELECT * FROM modules 
             WHERE is_major_module = TRUE 
             ORDER BY module_name ASC`
        );
        return rows;
    }

    static async getAllSub() {
        const [rows] = await pool.execute(
            `SELECT * FROM modules 
             WHERE is_major_module = FALSE 
             ORDER BY module_name ASC`
        );
        return rows;
    }

    static async getAll() {
        const [rows] = await pool.execute(
            `SELECT m.*, mc.category_name 
             FROM modules m 
             JOIN module_categories mc 
             ON m.category_id = mc.category_id 
             ORDER BY mc.category_name, 
                      m.is_major_module DESC, 
                      m.module_name`
        );
        return rows;
    }

    static async getPopularity(limit = 10) {
        const [rows] = await pool.execute(`
            SELECT 
                m.module_id,
                m.module_name,
                m.is_major_module,
                mc.category_name,
                COUNT(sms.selection_id) AS selection_count
            FROM modules m
            LEFT JOIN student_module_selections sms 
                ON m.module_id = sms.module_id
            LEFT JOIN module_categories mc 
                ON m.category_id = mc.category_id
            GROUP BY m.module_id
            ORDER BY selection_count DESC
            LIMIT ?
        `, [limit]);
        return rows;
    }

    static async getSelectionCount(moduleId) {
        const [rows] = await pool.execute(
            `SELECT COUNT(*) AS count 
             FROM student_module_selections 
             WHERE module_id = ?`,
            [moduleId]
        );
        return rows[0].count;
    }
}


export default Module;
