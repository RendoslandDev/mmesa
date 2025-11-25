import { pool } from '../config/database.js';

// ==================== SUBMIT SURVEY ====================
export async function submitSurvey(req, res) {
    const client = await pool.connect();

    try {
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

        if (!email || !indexNumber || !yearOfStudy || !selectedOption) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        await client.query('BEGIN');

        // Upsert student
        const studentUpsertQuery = `
            INSERT INTO students (email, index_number, year_of_study, whatsapp_phone)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO UPDATE
            SET whatsapp_phone = EXCLUDED.whatsapp_phone
            RETURNING id
        `;
        const studentResult = await client.query(studentUpsertQuery, [email, indexNumber, yearOfStudy, whatsappPhone]);
        const studentId = studentResult.rows[0].id;

        // Insert survey response
        const responseQuery = `
            INSERT INTO survey_responses (student_id, selected_option, additional_courses, submitted_at)
            VALUES ($1, $2, $3, NOW())
            RETURNING id
        `;
        const responseResult = await client.query(responseQuery, [studentId, selectedOption, additionalCourses || null]);
        const responseId = responseResult.rows[0].id;

        // Bulk insert modules
        if (selectedModules.length > 0) {
            const moduleValues = selectedModules.map((mId) => `(${studentId}, ${responseId}, ${mId})`).join(',');
            await client.query(`
                INSERT INTO student_module_selections (student_id, response_id, module_id)
                VALUES ${moduleValues}
            `);
        }

        // Bulk insert software
        if (selectedSoftware.length > 0) {
            const softwareValues = selectedSoftware.map((sId) => `(${studentId}, ${responseId}, ${sId})`).join(',');
            await client.query(`
                INSERT INTO student_software_selections (student_id, response_id, software_id)
                VALUES ${softwareValues}
            `);
        }

        await client.query('COMMIT');

        res.json({ success: true, message: 'Survey submitted successfully', responseId });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Survey submission error:', error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        client.release();
    }
}

// ==================== GET RESULTS ====================
export async function getResults(req, res) {
    try {
        const results = await pool.query(`
            SELECT sr.*, s.email, s.index_number, s.year_of_study, s.whatsapp_phone
            FROM survey_responses sr
            JOIN students s ON sr.student_id = s.id
            ORDER BY sr.submitted_at DESC
        `);

        res.json({ success: true, data: results.rows, count: results.rows.length });
    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// ==================== GET STATISTICS ====================
export async function getStatistics(req, res) {
    try {
        const totalResponses = (await pool.query('SELECT COUNT(*) FROM survey_responses')).rows[0].count;
        const totalStudents = (await pool.query('SELECT COUNT(*) FROM students')).rows[0].count;
        const totalModuleSelections = (await pool.query('SELECT COUNT(*) FROM student_module_selections')).rows[0].count;
        const totalSoftwareSelections = (await pool.query('SELECT COUNT(*) FROM student_software_selections')).rows[0].count;

        const topModules = (await pool.query(`
            SELECT m.id AS module_id, m.name AS module_name, m.is_major AS is_major_module,
                   COUNT(sms.id) AS selection_count
            FROM modules m
            LEFT JOIN student_module_selections sms ON m.id = sms.module_id
            GROUP BY m.id
            ORDER BY selection_count DESC
        `)).rows;

        const topSoftware = (await pool.query(`
            SELECT s.id AS software_id, s.name AS software_name,
                   COUNT(sss.id) AS selection_count
            FROM software s
            LEFT JOIN student_software_selections sss ON s.id = sss.software_id
            GROUP BY s.id
            ORDER BY selection_count DESC
        `)).rows;

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

// ==================== GET REPORT ====================
export async function getReport(req, res) {
    try {
        const { option } = req.query;

        let sql = `
            SELECT sr.*, s.email, s.index_number, s.year_of_study
            FROM survey_responses sr
            JOIN students s ON sr.student_id = s.id
        `;
        const params = [];
        if (option) {
            sql += ` WHERE sr.selected_option = $1`;
            params.push(option);
        }
        sql += ` ORDER BY sr.submitted_at DESC`;

        const results = await pool.query(sql, params);

        res.json({
            success: true,
            data: results.rows,
            count: results.rows.length,
            filter: option || 'all'
        });
    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}
