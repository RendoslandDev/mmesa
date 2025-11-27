import { pool, query } from '../config/database.js';

import { getValidModuleIds, getValidSoftwareIds } from '../utils/validationHelpers.js';


export async function getModules(req, res) {
    try {
        const result = await pool.query(`
            SELECT id, name, is_major, parent_id
            FROM modules
            ORDER BY id
        `);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Get modules error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getSoftware(req, res) {
    try {
        const result = await pool.query(`
            SELECT id, name
            FROM software
            ORDER BY id
        `);
        res.json({ success: true, data: result.rows });
    } catch (err) {
        console.error('Get software error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
}





export async function submitSurvey(req, res) {
    const connection = await getConnection();

    try {
        await connection.beginTransaction();

        const {
            email,
            indexNumber,
            yearOfStudy,
            whatsappPhone,
            selectedOption,
            selectedModules = [],
            selectedSoftware = [],
            additionalCourses
        } = req.body;

        if (!email || !indexNumber) {
            return res.status(400).json({
                success: false,
                error: "Email and index number required"
            });
        }

        // 1. Check or create student
        const [studentRows] = await connection.execute(
            "SELECT id FROM students WHERE email = ? AND index_number = ? LIMIT 1",
            [email, indexNumber]
        );

        let studentId;
        if (studentRows.length === 0) {
            const [insert] = await connection.execute(
                "INSERT INTO students (email, index_number) VALUES (?, ?)",
                [email, indexNumber]
            );
            studentId = insert.insertId;
        } else {
            studentId = studentRows[0].id;
        }

        // 2. Check if already submitted
        const [existing] = await connection.execute(
            "SELECT id FROM survey_responses WHERE student_id = ? LIMIT 1",
            [studentId]
        );

        if (existing.length > 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                error: "You already submitted the survey"
            });
        }

        // 3. Insert survey response
        await connection.execute(
            `INSERT INTO survey_responses 
            (student_id, year_of_study, whatsapp_phone, selected_option, selected_modules, selected_software, additional_courses)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                studentId,
                yearOfStudy,
                whatsappPhone,
                selectedOption,
                JSON.stringify(selectedModules),
                JSON.stringify(selectedSoftware),
                additionalCourses || null
            ]
        );

        await connection.commit();

        return res.status(200).json({
            success: true,
            message: "Survey submitted successfully"
        });

    } catch (error) {
        await connection.rollback();
        console.error("Survey submit error:", error);
        return res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}







export async function getResults(req, res) {
    try {
        const results = await query(
            `SELECT sr.*, s.email, s.index_number, s.year_of_study, s.whatsapp_phone
       FROM survey_responses sr
       JOIN students s ON sr.student_id = s.id
       ORDER BY sr.submitted_at DESC`
        );

        res.json({
            success: true,
            data: results,
            count: results.length
        });

    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export async function getStatistics(req, res) {
    try {
        // Total responses
        const [totalResponsesRow] = await query('SELECT COUNT(*) as count FROM survey_responses');
        const totalResponses = totalResponsesRow?.count || 0;

        // Total students
        const [totalStudentsRow] = await query('SELECT COUNT(*) as count FROM students');
        const totalStudents = totalStudentsRow?.count || 0;

        // Total module selections
        const [totalModuleSelectionsRow] = await query('SELECT COUNT(*) as count FROM student_module_selections');
        const totalModuleSelections = totalModuleSelectionsRow?.count || 0;

        // Total software selections
        const [totalSoftwareSelectionsRow] = await query('SELECT COUNT(*) as count FROM student_software_selections');
        const totalSoftwareSelections = totalSoftwareSelectionsRow?.count || 0;

        // Top modules
        const topModules = await query(
            `SELECT m.id AS module_id, m.name AS module_name, m.is_major AS is_major_module, 
                    COUNT(sms.id) AS selection_count
             FROM modules m
             LEFT JOIN student_module_selections sms ON m.id = sms.module_id
             GROUP BY m.id
             ORDER BY selection_count DESC`
        );

        // Top software
        const topSoftware = await query(
            `SELECT s.id AS software_id, s.name AS software_name, 
                    COUNT(sss.id) AS selection_count
             FROM software s
             LEFT JOIN student_software_selections sss ON s.id = sss.software_id
             GROUP BY s.id
             ORDER BY selection_count DESC`
        );

        res.json({
            success: true,
            stats: {
                totalResponses,
                totalStudents,
                totalModuleSelections,
                totalSoftwareSelections,
                modulePopularity: topModules,
                softwarePopularity: topSoftware
            }
        });
    } catch (error) {
        console.error('Statistics error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}




export async function getReport(req, res) {
    try {
        const { option } = req.query;

        let sql = `SELECT sr.*, s.email, s.index_number, s.year_of_study
               FROM survey_responses sr
               JOIN students s ON sr.student_id = s.id`;

        const params = [];

        if (option) {
            sql += ` WHERE sr.selected_option = ?`;
            params.push(option);
        }

        sql += ` ORDER BY sr.submitted_at DESC`;

        const results = await query(sql, params);

        res.json({
            success: true,
            data: results,
            count: results.length,
            filter: option || 'all'
        });

    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

