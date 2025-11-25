// controllers/adminController.js
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

export async function login(req, res) {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                error: 'Username and password required'
            });
        }

        // Query admin user
        const admins = await query(
            'SELECT * FROM admin_users WHERE username = $1 LIMIT 1',
            [username]
        );

        if (!admins || admins.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const admin = admins[0];

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            success: true,
            message: 'Login successful',
            token,
            admin: {
                id: admin.id,
                username: admin.username,
                role: admin.role
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export async function getAdminStats(req, res) {
    try {
        // Total students
        const totalStudentsResult = await query('SELECT COUNT(*) AS count FROM students');
        const totalStudents = totalStudentsResult[0]?.count || 0;

        // Total responses
        const totalResponsesResult = await query('SELECT COUNT(*) AS count FROM survey_responses');
        const totalResponses = totalResponsesResult[0]?.count || 0;

        // Total module selections
        const totalModuleSelectionsResult = await query(
            'SELECT COUNT(*) AS count FROM student_module_selections'
        );
        const totalModuleSelections = totalModuleSelectionsResult[0]?.count || 0;

        // Total software selections
        const totalSoftwareSelectionsResult = await query(
            'SELECT COUNT(*) AS count FROM student_software_selections'
        );
        const totalSoftwareSelections = totalSoftwareSelectionsResult[0]?.count || 0;

        // Top 5 modules
        const topModulesResult = await query(
            `SELECT m.id AS module_id, m.name AS module_name, m.is_major, COUNT(sms.id) AS selection_count
             FROM modules m
             LEFT JOIN student_module_selections sms ON m.id = sms.module_id
             GROUP BY m.id, m.name, m.is_major
             ORDER BY selection_count DESC
             LIMIT 5`
        );

        // Top 6 software
        const topSoftwareResult = await query(
            `SELECT s.id AS software_id, s.name AS software_name, COUNT(sss.id) AS selection_count
             FROM software s
             LEFT JOIN student_software_selections sss ON s.id = sss.software_id
             GROUP BY s.id, s.name
             ORDER BY selection_count DESC
             LIMIT 6`
        );

        // Option breakdown
        const optionBreakdownResult = await query(
            `SELECT selected_option, COUNT(*) AS count
             FROM survey_responses
             GROUP BY selected_option
             ORDER BY selected_option`
        );

        res.json({
            success: true,
            stats: {
                totalStudents,
                totalResponses,
                totalModuleSelections,
                totalSoftwareSelections,
                modulePopularity: topModulesResult.map(m => ({
                    module_id: m.module_id,
                    module_name: m.module_name,
                    is_major_module: m.is_major === true || m.is_major === 1,
                    selection_count: m.selection_count
                })),
                softwarePopularity: topSoftwareResult.map(s => ({
                    software_id: s.software_id,
                    software_name: s.software_name,
                    selection_count: s.selection_count
                })),
                optionBreakdown: optionBreakdownResult
            }
        });

    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export async function exportToCSV(req, res) {
    try {
        const results = await query(
            `SELECT sr.id, s.email, s.index_number, s.year_of_study, s.whatsapp_phone, 
                    sr.selected_option, sr.submitted_at
             FROM survey_responses sr
             JOIN students s ON sr.student_id = s.id
             ORDER BY sr.submitted_at DESC`
        );

        let csv = 'ID,Email,Index Number,Year of Study,WhatsApp Phone,Selected Option,Submitted At\n';

        results.forEach(row => {
            const submittedAt = row.submitted_at.toISOString(); // convert timestamp to ISO string
            csv += `${row.id},"${row.email}","${row.index_number}","${row.year_of_study}","${row.whatsapp_phone}","${row.selected_option}","${submittedAt}"\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=survey_responses.csv');
        res.send(csv);

    } catch (error) {
        console.error('CSV export error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

export default {
    login,
    getAdminStats,
    exportToCSV
};
