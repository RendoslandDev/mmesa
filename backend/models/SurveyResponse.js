const pool = require('../config/database');

class SurveyResponse {
    static async create(studentId, selectedOption, additionalCourse = null) {
        try {
            const [result] = await pool.execute(
                'INSERT INTO survey_responses (student_id, selected_option, additional_course_suggestion) VALUES (?, ?, ?)',
                [studentId, selectedOption, additionalCourse]
            );
            return result.insertId;
        } catch (error) {
            throw new Error('Failed to create survey response: ' + error.message);
        }
    }

    static async findById(responseId) {
        const [rows] = await pool.execute(
            'SELECT * FROM survey_responses WHERE response_id = ?',
            [responseId]
        );
        return rows[0] || null;
    }

    static async findByStudent(studentId) {
        const [rows] = await pool.execute(
            'SELECT * FROM survey_responses WHERE student_id = ? ORDER BY submitted_at DESC',
            [studentId]
        );
        return rows;
    }

    static async getAll() {
        const [rows] = await pool.execute(
            'SELECT * FROM survey_responses ORDER BY submitted_at DESC'
        );
        return rows;
    }

    // static async getStatistics() {
    //     const [stats] = await pool.execute(`
    //   SELECT 
    //     COUNT(DISTINCT response_id) as total_responses,
    //     selected_option,
    //     COUNT(*) as option_count,
    //     COUNT(DISTINCT student_id) as unique_students
    //   FROM survey_responses
    //   GROUP BY selected_option
    // `);
    //     return stats;
    // }
    static async getStatistics() {
        // Survey response counts and options
        const [optionStats] = await pool.execute(`
        SELECT selected_option, COUNT(*) as count
        FROM survey_responses
        GROUP BY selected_option
    `);

        // Total responses
        const totalResponses = await this.getTotalCount();

        // Total module selections
        const totalModuleSelections = await this.getTotalModuleSelections();

        // Total software selections
        const totalSoftwareSelections = await this.getTotalSoftwareSelections();

        return {
            totalResponses,
            totalModuleSelections,
            totalSoftwareSelections,
            optionBreakdown: optionStats
        };
    }


    static async getTotalCount() {
        const [rows] = await pool.execute('SELECT COUNT(*) as count FROM survey_responses');
        return rows[0].count;
    }

    static async getResponsesByOption(option) {
        const [rows] = await pool.execute(
            'SELECT * FROM survey_responses WHERE selected_option = ? ORDER BY submitted_at DESC',
            [option]
        );
        return rows;
    }
}
export default SurveyResponse;
