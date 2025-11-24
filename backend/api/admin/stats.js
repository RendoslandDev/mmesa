// backend/api/admin/stats.js
import { getAdminStats } from '../../../controllers/adminController.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getAdminStats(req, res);
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
