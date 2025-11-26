import { pool } from '../config/database.js';



// ==================== SUBMIT SURVEY ====================
// export async function submitSurvey(req, res) {
//     const client = await pool.connect();
// 
//     try {
//         const {
//             email,
//             indexNumber,
//             yearOfStudy,
//             whatsappPhone,
//             selectedOption,
//             selectedModules = [],
//             selectedSoftware = [],
//             additionalCourses
//         } = req.body;
// 
//         if (!email || !indexNumber || !yearOfStudy || !selectedOption) {
//             return res.status(400).json({ success: false, error: 'Missing required fields' });
//         }
// 
//         await client.query('BEGIN');
// 
//         // Upsert student
//         const studentResult = await client.query(
//             `
//             INSERT INTO students (email, index_number, year_of_study, whatsapp_phone)
//             VALUES ($1, $2, $3, $4)
//             ON CONFLICT (email) DO UPDATE
//             SET whatsapp_phone = EXCLUDED.whatsapp_phone
//             RETURNING id
//             `,
//             [email, indexNumber, yearOfStudy, whatsappPhone]
//         );
//         const studentId = studentResult.rows[0].id;
// 
//         // Check if student already submitted
//         const existingResponse = await client.query(
//             `SELECT id FROM survey_responses WHERE student_id = $1`,
//             [studentId]
//         );
//         if (existingResponse.rows.length > 0) {
//             await client.query('ROLLBACK');
//             return res.status(403).json({ success: false, error: 'You have already submitted the survey' });
//         }
// 
//         // Insert survey response
//         const responseResult = await client.query(
//             `
//             INSERT INTO survey_responses (student_id, selected_option, additional_courses, submitted_at)
//             VALUES ($1, $2, $3, NOW())
//             RETURNING id
//             `,
//             [studentId, selectedOption, additionalCourses || null]
//         );
//         const responseId = responseResult.rows[0].id;
// 
//         //         // Validate module IDs
//         //         let validModuleIds = [];
//         //         if (selectedModules.length > 0) {
//         //             const moduleResult = await client.query(
//         //                 `SELECT id FROM modules WHERE id = ANY($1::int[])`,
//         //                 [selectedModules]
//         //             );
//         //             validModuleIds = moduleResult.rows.map(r => r.id);
//         //         }
//         // 
//         //         // Bulk insert valid modules
//         //         for (const mId of validModuleIds) {
//         //             await client.query(
//         //                 `INSERT INTO student_module_selections (student_id, response_id, module_id)
//         //                  VALUES ($1, $2, $3)`,
//         //                 [studentId, responseId, mId]
//         //             );
//         //         }
// 
//         // Validate module selection rules
//         //         if (selectedModules.length > 0) {
//         //             // Fetch module details
//         //             const moduleResult = await client.query(
//         //                 `SELECT id, is_major, category FROM modules WHERE id = ANY($1::int[])`,
//         //                 [selectedModules]
//         //             );
//         //             const modules = moduleResult.rows;
//         // 
//         //             // Check major module constraint
//         //             const majorIds = modules.filter(m => m.is_major).map(m => m.id);
//         //             if (majorIds.length > 1) {
//         //                 throw new Error("You can select only one major module");
//         //             }
//         // 
//         //             // Check category constraint
//         //             const categoryCount = {};
//         //             for (const m of modules) {
//         //                 if (!categoryCount[m.category]) categoryCount[m.category] = 0;
//         //                 categoryCount[m.category]++;
//         //                 if (categoryCount[m.category] > 1) {
//         //                     throw new Error(`You cannot select more than one module from category "${m.category}"`);
//         //                 }
//         //             }
//         // 
//         //             // After validation, insert into student_module_selections
//         //             for (const m of modules) {
//         //                 await client.query(
//         //                     `INSERT INTO student_module_selections (student_id, response_id, module_id)
//         //              VALUES ($1, $2, $3)`,
//         //                     [studentId, responseId, m.id]
//         //                 );
//         //             }
//         //         }
//         // Validate module selection rules
//         if (selectedModules.length > 0) {
//             const moduleResult = await client.query(
//                 `SELECT id, is_major, category, parent_id FROM modules WHERE id = ANY($1::int[])`,
//                 [selectedModules]
//             );
// 
//             const modules = moduleResult.rows;
// 
//             // Convert to quick lookup
//             const selectedSet = new Set(selectedModules);
// 
//             // Check major module rule
//             const majorIds = modules.filter(m => m.is_major).map(m => m.id);
//             if (majorIds.length > 1) {
//                 throw new Error("You can select only one major module");
//             }
// 
//             // Check category constraint
//             const categoryCount = {};
//             for (const m of modules) {
//                 if (!categoryCount[m.category]) categoryCount[m.category] = 0;
//                 categoryCount[m.category]++;
//                 if (categoryCount[m.category] > 1) {
//                     throw new Error(`Only one module allowed in category: ${m.category}`);
//                 }
//             }
// 
//             // 🔥 Parent–child module rule
//             for (const m of modules) {
//                 if (m.parent_id) {
//                     // This is a submodule
//                     if (selectedSet.has(m.parent_id)) {
//                         throw new Error(`Cannot select submodule ${m.id} and its parent ${m.parent_id}`);
//                     }
// 
//                     // Check siblings
//                     const siblings = modules.filter(x => x.parent_id === m.parent_id);
//                     if (siblings.length > 1) {
//                         throw new Error(`Only one submodule allowed under parent ID ${m.parent_id}`);
//                     }
// 
//                 } else {
//                     // This is a parent module
//                     const children = modules.filter(x => x.parent_id === m.id);
//                     if (children.length > 0) {
//                         throw new Error(`Cannot select module ${m.id} and its submodules`);
//                     }
//                 }
//             }
// 
//             // Insert valid selections
//             for (const m of modules) {
//                 await client.query(
//                     `INSERT INTO student_module_selections (student_id, response_id, module_id)
//              VALUES ($1, $2, $3)`,
//                     [studentId, responseId, m.id]
//                 );
//             }
//         }
// 
// 
// 
//         // Validate software IDs
//         let validSoftwareIds = [];
//         if (selectedSoftware.length > 0) {
//             const softwareResult = await client.query(
//                 `SELECT id FROM software WHERE id = ANY($1::int[])`,
//                 [selectedSoftware]
//             );
//             validSoftwareIds = softwareResult.rows.map(r => r.id);
//         }
// 
//         // Bulk insert valid software
//         for (const sId of validSoftwareIds) {
//             await client.query(
//                 `INSERT INTO student_software_selections (student_id, response_id, software_id)
//                  VALUES ($1, $2, $3)`,
//                 [studentId, responseId, sId]
//             );
//         }
// 
//         await client.query('COMMIT');
//         res.json({ success: true, message: 'Survey submitted successfully', responseId });
// 
//     } catch (error) {
//         await client.query('ROLLBACK');
//         console.error('Survey submission error:', error);
//         res.status(500).json({ success: false, error: error.message });
//     } finally {
//         client.release();
//     }
// }
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

        // Required fields check
        if (!email || !indexNumber || !yearOfStudy || !selectedOption) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        await client.query('BEGIN');

        // Upsert student
        const studentResult = await client.query(
            `
            INSERT INTO students (email, index_number, year_of_study, whatsapp_phone)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO UPDATE
            SET whatsapp_phone = EXCLUDED.whatsapp_phone
            RETURNING id
            `,
            [email, indexNumber, yearOfStudy, whatsappPhone]
        );
        const studentId = studentResult.rows[0].id;

        // Check if student already submitted
        const existingResponse = await client.query(
            `SELECT id FROM survey_responses WHERE student_id = $1`,
            [studentId]
        );
        if (existingResponse.rows.length > 0) {
            await client.query('ROLLBACK');
            return res.status(403).json({ success: false, error: 'You have already submitted the survey' });
        }

        // Insert survey response
        const responseResult = await client.query(
            `
            INSERT INTO survey_responses (student_id, selected_option, additional_courses, submitted_at)
            VALUES ($1, $2, $3, NOW())
            RETURNING id
            `,
            [studentId, selectedOption, additionalCourses || null]
        );
        const responseId = responseResult.rows[0].id;

        // Fetch module details
        let modules = [];
        if (selectedModules.length > 0) {
            const moduleResult = await client.query(
                `SELECT id, is_major, category, parent_id FROM modules WHERE id = ANY($1::int[])`,
                [selectedModules]
            );
            modules = moduleResult.rows;
        }

        // Separate majors and submodules
        const majors = modules.filter(m => m.is_major);
        const subModules = modules.filter(m => !m.is_major);

        // --- Validation rules per option ---
        if (selectedOption === 'Option 1') {
            if (subModules.length > 0) throw new Error('Option 1 allows only major modules');
            if (majors.length > 1) throw new Error('Option 1 allows only one major module');
        }

        if (selectedOption === 'Option 2') {
            if (majors.length !== 1) throw new Error('Option 2 requires exactly one major module');
            const majorId = majors[0].id;

            // No submodules under selected major
            const invalidSub = subModules.filter(s => s.parent_id === majorId);
            if (invalidSub.length > 0) {
                throw new Error(`Cannot select submodules under selected major (${majorId})`);
            }
        }

        if (selectedOption === 'Option 3') {
            if (majors.length > 0) throw new Error('Option 3 allows only submodules');
            if (subModules.length > 4) throw new Error('Option 3 allows a maximum of 4 submodules');
        }

        // --- Parent–child rule (all options) ---
        const parentIds = new Set(modules.filter(m => !m.parent_id).map(m => m.id));
        for (const m of modules) {
            if (m.parent_id && parentIds.has(m.parent_id)) {
                throw new Error(`Cannot select submodule ${m.id} and its parent ${m.parent_id}`);
            }
        }

        // --- Insert modules (bulk insert) ---
        if (modules.length > 0) {
            const values = modules.map((m, idx) => `($1, $2, $${idx + 3})`).join(',');
            const params = [studentId, responseId, ...modules.map(m => m.id)];
            await client.query(
                `INSERT INTO student_module_selections (student_id, response_id, module_id) VALUES ${values}`,
                params
            );
        }

        // --- Insert software selections (bulk insert) ---
        if (selectedSoftware.length > 0) {
            const softwareResult = await client.query(
                `SELECT id FROM software WHERE id = ANY($1::int[])`,
                [selectedSoftware]
            );
            const validSoftwareIds = softwareResult.rows.map(r => r.id);

            const values = validSoftwareIds.map((sId, idx) => `($1, $2, $${idx + 3})`).join(',');
            const params = [studentId, responseId, ...validSoftwareIds];
            await client.query(
                `INSERT INTO student_software_selections (student_id, response_id, software_id) VALUES ${values}`,
                params
            );
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
