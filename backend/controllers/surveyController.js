import { query, pool } from '../config/database.js';


export async function submitSurvey(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ success: false, error: `Method ${req.method} Not Allowed` });
    }
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://mmesa-client.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ success: false, error: 'Method not allowed' });

    let connection;

    try {
        connection = await pool.getConnection();

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

        // Validate required fields
        if (!email || !indexNumber || !yearOfStudy || !selectedOption) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Start transaction
        await connection.beginTransaction();

        // Insert or update student safely
        const [studentResult] = await connection.execute(
            `INSERT INTO students (email, index_number, year_of_study, whatsapp_phone)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE whatsapp_phone = ?`,
            [email, indexNumber, yearOfStudy, whatsappPhone, whatsappPhone]
        );

        // Retrieve student ID
        const [studentRows] = await connection.execute(
            'SELECT id FROM students WHERE email = ?',
            [email]
        );
        if (!studentRows || studentRows.length === 0) {
            throw new Error('Failed to retrieve student ID');
        }
        const studentId = studentRows[0].id;

        // Insert survey response
        const [responseResult] = await connection.execute(
            `INSERT INTO survey_responses (student_id, selected_option, additional_courses, submitted_at)
             VALUES (?, ?, ?, NOW())`,
            [studentId, selectedOption, additionalCourses || null]
        );
        const responseId = responseResult.insertId;

        // Bulk insert modules using prepared statement
        if (selectedModules.length > 0) {
            const moduleValues = selectedModules.map(mId => [studentId, mId, responseId]);
            await connection.query(
                `INSERT INTO student_module_selections (student_id, module_id, response_id) VALUES ?`,
                [moduleValues]
            );
        }

        // Bulk insert software using prepared statement
        if (selectedSoftware.length > 0) {
            const softwareValues = selectedSoftware.map(sId => [studentId, sId, responseId]);
            await connection.query(
                `INSERT INTO student_software_selections (student_id, software_id, response_id) VALUES ?`,
                [softwareValues]
            );
        }

        // Commit transaction
        await connection.commit();

        res.json({
            success: true,
            message: 'Survey submitted successfully',
            responseId
        });

    } catch (error) {
        // Rollback transaction on error
        if (connection) await connection.rollback();
        console.error('Survey submission error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    } finally {
        if (connection) connection.release(); // release connection back to pool
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

