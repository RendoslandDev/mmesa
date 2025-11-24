// backend/api/students/year/[year].js
import { getStudentsByYear } from '../../../../controllers/studentController.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getStudentsByYear(req, res);
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
