import { pool, query } from '../config/database.js'; // your pg Pool
import { getValidModuleIds, getValidSoftwareIds } from '../utils/validationHelpers.js';

// --------------------------- GET MODULES ---------------------------
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

// --------------------------- GET SOFTWARE ---------------------------
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
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const {
            email,
            indexNumber,
            yearOfStudy,        // optional: store in students
            whatsappPhone,      // optional: store in students
            selectedOption,
            selectedModules = [],
            selectedSoftware = [],
            additionalCourses
        } = req.body;

        if (!email || !indexNumber) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                error: "Email and index number required"
            });
        }

        // 1️⃣ Check or create student
        const studentResult = await client.query(
            "SELECT id FROM students WHERE email = $1 AND index_number = $2 LIMIT 1",
            [email, indexNumber]
        );

        let studentId;
        if (studentResult.rows.length === 0) {
            const insertStudent = await client.query(
                `INSERT INTO students (email, index_number, year_of_study, whatsapp_phone)
                 VALUES ($1, $2, $3, $4) RETURNING id`,
                [email, indexNumber, yearOfStudy || null, whatsappPhone || null]
            );
            studentId = insertStudent.rows[0].id;
        } else {
            studentId = studentResult.rows[0].id;

            // Optional: update student info if yearOfStudy or whatsappPhone provided
            if (yearOfStudy || whatsappPhone) {
                await client.query(
                    `UPDATE students SET 
                        year_of_study = COALESCE($1, year_of_study),
                        whatsapp_phone = COALESCE($2, whatsapp_phone)
                     WHERE id = $3`,
                    [yearOfStudy || null, whatsappPhone || null, studentId]
                );
            }
        }

        // 2️⃣ Check if survey already submitted
        const existing = await client.query(
            "SELECT id FROM survey_responses WHERE student_id = $1 LIMIT 1",
            [studentId]
        );

        if (existing.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(400).json({
                success: false,
                error: "You already submitted the survey"
            });
        }

        // 3️⃣ Insert survey response (only allowed columns)
        const insertSurvey = await client.query(
            `INSERT INTO survey_responses 
                (student_id, selected_option, additional_courses)
             VALUES ($1, $2, $3) RETURNING id`,
            [studentId, selectedOption, additionalCourses || null]
        );

        const surveyId = insertSurvey.rows[0].id;

        // 4️⃣ Insert selected modules
        if (selectedModules.length > 0) {
            const validModuleIds = await getValidModuleIds(selectedModules); // helper function
            for (const moduleId of validModuleIds) {
                await client.query(
                    `INSERT INTO student_module_selections (response_id, student_id, module_id)
     VALUES ($1, $2, $3)`,
                    [surveyId, studentId, moduleId]
                );

            }
        }

        // 5️⃣ Insert selected software
        if (selectedSoftware.length > 0) {
            const validSoftwareIds = await getValidSoftwareIds(selectedSoftware); // helper function
            for (const softwareId of validSoftwareIds) {
                await client.query(
                    `INSERT INTO student_software_selections (response_id, student_id, software_id)
     VALUES ($1, $2, $3)`,
                    [surveyId, studentId, softwareId]
                );

            }
        }

        await client.query('COMMIT');

        res.status(200).json({
            success: true,
            message: "Survey submitted successfully"
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error("Survey submit error:", error);
        res.status(500).json({ success: false, error: error.message || "Server error" });
    } finally {
        client.release();
    }
}


// --------------------------- GET RESULTS ---------------------------
// --------------------------- GET RESULTS ---------------------------
export async function getResults(req, res) {
    try {
        const result = await pool.query(`
          SELECT sr.id AS survey_id,
       sr.selected_option,
       sr.additional_courses,
       sr.submitted_at,
       s.id AS student_id,
       s.email,
       s.index_number,
       s.year_of_study,
       s.whatsapp_phone,
       COALESCE(json_agg(DISTINCT m.name) FILTER (WHERE m.name IS NOT NULL), '[]') AS selected_modules,
       COALESCE(json_agg(DISTINCT sw.name) FILTER (WHERE sw.name IS NOT NULL), '[]') AS selected_software
FROM survey_responses sr
JOIN students s ON sr.student_id = s.id
LEFT JOIN student_module_selections sms ON sms.response_id = sr.id
LEFT JOIN modules m ON m.id = sms.module_id
LEFT JOIN student_software_selections sss ON sss.response_id = sr.id
LEFT JOIN software sw ON sw.id = sss.software_id
GROUP BY sr.id, s.id
ORDER BY sr.submitted_at DESC;

        `);

        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount
        });
    } catch (error) {
        console.error('Get results error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// --------------------------- GET REPORT ---------------------------
export async function getReport(req, res) {
    try {
        const { option } = req.query;

        let sql = `
            SELECT sr.id AS survey_id,
                   sr.selected_option,
                   sr.additional_courses,
                   sr.submitted_at,
                   s.id AS student_id,
                   s.email,
                   s.index_number,
                   s.year_of_study,
                   s.whatsapp_phone,
                   COALESCE(json_agg(DISTINCT m.id) FILTER (WHERE m.id IS NOT NULL), '[]') AS selected_module_ids,
                   COALESCE(json_agg(DISTINCT m.name) FILTER (WHERE m.name IS NOT NULL), '[]') AS selected_module_names,
                   COALESCE(json_agg(DISTINCT sw.id) FILTER (WHERE sw.id IS NOT NULL), '[]') AS selected_software_ids,
                   COALESCE(json_agg(DISTINCT sw.name) FILTER (WHERE sw.name IS NOT NULL), '[]') AS selected_software_names
            FROM survey_responses sr
            JOIN students s ON sr.student_id = s.id
            LEFT JOIN student_module_selections sms ON sms.response_id = sr.id
            LEFT JOIN modules m ON m.id = sms.module_id
            LEFT JOIN student_software_selections sss ON sss.response_id = sr.id
            LEFT JOIN software sw ON sw.id = sss.software_id
        `;

        const params = [];
        if (option) {
            sql += ` WHERE sr.selected_option = $1`;
            params.push(option);
        }

        sql += ` GROUP BY sr.id, s.id ORDER BY sr.submitted_at DESC`;

        const result = await pool.query(sql, params);

        res.json({
            success: true,
            data: result.rows,
            count: result.rowCount,
            filter: option || 'all'
        });
    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

// --------------------------- GET STATISTICS ---------------------------
export async function getStatistics(req, res) {
    try {
        const totalResponsesResult = await pool.query(
            'SELECT COUNT(*) AS count FROM survey_responses'
        );

        const totalStudentsResult = await pool.query(
            'SELECT COUNT(*) AS count FROM students'
        );

        // 👇 FIXED — unique students, not total rows
        const totalModuleSelectionsResult = await pool.query(
            'SELECT COUNT(DISTINCT student_id) AS count FROM student_module_selections'
        );

        const totalSoftwareSelectionsResult = await pool.query(
            'SELECT COUNT(DISTINCT student_id) AS count FROM student_software_selections'
        );

        const topModulesResult = await pool.query(`
            SELECT m.id AS module_id, m.name AS module_name, m.is_major AS is_major_module,
                   COUNT(sms.id) AS selection_count
            FROM modules m
            LEFT JOIN student_module_selections sms ON m.id = sms.module_id
            GROUP BY m.id
            ORDER BY selection_count DESC
        `);

        const topSoftwareResult = await pool.query(`
            SELECT s.id AS software_id, s.name AS software_name,
                   COUNT(sss.id) AS selection_count
            FROM software s
            LEFT JOIN student_software_selections sss ON s.id = sss.software_id
            GROUP BY s.id
            ORDER BY selection_count DESC
        `);

        res.json({
            success: true,
            stats: {
                totalResponses: parseInt(totalResponsesResult.rows[0].count),
                totalStudents: parseInt(totalStudentsResult.rows[0].count),

                // 👇 FIXED
                totalModuleSelections: parseInt(totalModuleSelectionsResult.rows[0].count),
                totalSoftwareSelections: parseInt(totalSoftwareSelectionsResult.rows[0].count),

                modulePopularity: topModulesResult.rows,
                softwarePopularity: topSoftwareResult.rows
            }
        });

    } catch (error) {
        console.error('Statistics error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

