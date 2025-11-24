// backend/api/surveys/report.js
import { getReport } from '../../../controllers/surveyController.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getReport(req, res);
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
