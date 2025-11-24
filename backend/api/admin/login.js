// backend/api/admin/login.js
import { login } from '../../../controllers/adminController.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await login(req, res);
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
