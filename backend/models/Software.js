const pool = require('../config/database');

class Software {
    static async findById(softwareId) {
        const [rows] = await pool.execute(
            'SELECT * FROM software WHERE software_id = ?',
            [softwareId]
        );
        return rows[0] || null;
    }

    static async findByName(softwareName) {
        const [rows] = await pool.execute(
            'SELECT * FROM software WHERE software_name = ?',
            [softwareName]
        );
        return rows[0] || null;
    }

    static async getAll() {
        const [rows] = await pool.execute(
            'SELECT * FROM software ORDER BY software_name ASC'
        );
        return rows;
    }

    static async getPopularity(limit = 10) {
        const [rows] = await pool.execute(`
      SELECT 
        s.software_id,
        s.software_name,
        COUNT(sss.selection_id) as selection_count
      FROM software s
      LEFT JOIN student_software_selections sss ON s.software_id = sss.software_id
      GROUP BY s.software_id
      ORDER BY selection_count DESC
      LIMIT ?
    `, [limit]);
        return rows;
    }

    static async getSelectionCount(softwareId) {
        const [rows] = await pool.execute(
            'SELECT COUNT(*) as count FROM student_software_selections WHERE software_id = ?',
            [softwareId]
        );
        return rows[0].count;
    }

    static async getTotalCount() {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM software');
        return rows[0].count;
    }
}

export default Software;
