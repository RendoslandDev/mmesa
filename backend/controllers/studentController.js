// ==================== studentController.js (FIXED) ====================
import { query } from '../config/database.js';

export async function getAllStudents(req, res) {
    try {
        const students = await query('SELECT * FROM students ORDER BY created_at DESC');
        res.json({ success: true, data: students, count: students.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export async function getStudentById(req, res) {
    try {
        const { id } = req.params;
        const students = await query('SELECT * FROM students WHERE id = ?', [id]);

        if (students.length === 0) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        res.json({ success: true, data: students[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export async function getStudentByEmail(req, res) {
    try {
        const { email } = req.params;
        const students = await query('SELECT * FROM students WHERE email = ?', [email]);

        if (students.length === 0) {
            return res.status(404).json({ success: false, error: 'Student not found' });
        }

        res.json({ success: true, data: students[0] });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export async function getStudentsByYear(req, res) {
    try {
        const { year } = req.params;
        const students = await query('SELECT * FROM students WHERE year_of_study = ? ORDER BY created_at DESC', [year]);
        res.json({ success: true, data: students, count: students.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

export async function getStudentStats(req, res) {
    try {
        const totalStudents = await query('SELECT COUNT(*) as count FROM students');
        const studentsWithResponses = await query(
            'SELECT COUNT(DISTINCT student_id) as count FROM survey_responses'
        );
        const byYear = await query(
            'SELECT year_of_study, COUNT(*) as count FROM students GROUP BY year_of_study'
        );

        res.json({
            success: true,
            data: {
                totalStudents: totalStudents[0]?.count || 0,
                studentsWithResponses: studentsWithResponses[0]?.count || 0,
                byYear
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
