// backend/api/students/email/[email].js
import { getStudentByEmail } from '../../../../controllers/studentController.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getStudentByEmail(req, res);
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
