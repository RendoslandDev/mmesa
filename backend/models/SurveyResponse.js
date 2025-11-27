// models/SurveyResponse.js
import { query } from '../config/database.js';

class SurveyResponse {
    static async create(studentId, selectedOption, additionalCourses = null) {
        try {
            const result = await query(
                `INSERT INTO survey_responses (student_id, selected_option, additional_courses)
             VALUES ($1, $2, $3)
             RETURNING id`,
                [studentId, selectedOption, additionalCourses]
            );
            return result.rows[0]?.id;
        } catch (error) {
            throw new Error('Failed to create survey response: ' + error.message);
        }
    }


    static async findById(responseId) {
        const rows = await query(
            `SELECT * FROM survey_responses WHERE id = $1`,
            [responseId]
        );
        return rows[0] || null;
    }

    static async findByStudent(studentId) {
        return await query(
            `SELECT * FROM survey_responses WHERE student_id = $1 ORDER BY submitted_at DESC`,
            [studentId]
        );
    }

    static async getAll() {
        return await query(
            `SELECT * FROM survey_responses ORDER BY submitted_at DESC`
        );
    }

    static async getStatistics() {
        const optionBreakdownResult = await query(`
        SELECT selected_option, COUNT(*) as count
        FROM survey_responses
        GROUP BY selected_option
    `);

        const totalResponsesResult = await query(`SELECT COUNT(*) as count FROM survey_responses`);
        const totalModuleSelectionsResult = await query(`SELECT COUNT(*) as count FROM student_module_selections`);
        const totalSoftwareSelectionsResult = await query(`SELECT COUNT(*) as count FROM student_software_selections`);

        return {
            totalResponses: Number(totalResponsesResult.rows[0].count),
            totalModuleSelections: Number(totalModuleSelectionsResult.rows[0].count),
            totalSoftwareSelections: Number(totalSoftwareSelectionsResult.rows[0].count),
            optionBreakdown: optionBreakdownResult.rows
        };
    }


    static async getResponsesByOption(option) {
        return await query(
            `SELECT * FROM survey_responses WHERE selected_option = $1 ORDER BY submitted_at DESC`,
            [option]
        );
    }
}

export default SurveyResponse;
