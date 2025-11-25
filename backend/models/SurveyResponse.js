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
            return result[0]?.id;
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
        const optionBreakdown = await query(`
            SELECT selected_option, COUNT(*) as count
            FROM survey_responses
            GROUP BY selected_option
        `);

        const totalResponsesResult = await query(`SELECT COUNT(*) as count FROM survey_responses`);
        const totalResponses = totalResponsesResult[0]?.count || 0;

        const totalModuleSelectionsResult = await query(`SELECT COUNT(*) as count FROM student_module_selections`);
        const totalModuleSelections = totalModuleSelectionsResult[0]?.count || 0;

        const totalSoftwareSelectionsResult = await query(`SELECT COUNT(*) as count FROM student_software_selections`);
        const totalSoftwareSelections = totalSoftwareSelectionsResult[0]?.count || 0;

        return {
            totalResponses,
            totalModuleSelections,
            totalSoftwareSelections,
            optionBreakdown
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
