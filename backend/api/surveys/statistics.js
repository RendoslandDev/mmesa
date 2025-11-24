// backend/api/surveys/statistics.js
import { getStatistics } from '../../../controllers/surveyController.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getStatistics(req, res);
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
