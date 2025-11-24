// backend/api/students/stats.js
import { getStudentStats } from '../../../controllers/studentController.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getStudentStats(req, res);
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
