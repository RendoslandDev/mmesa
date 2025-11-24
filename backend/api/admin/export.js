// backend/api/admin/export.js
import { exportToCSV } from '../../../controllers/adminController.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await exportToCSV(req, res);
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
