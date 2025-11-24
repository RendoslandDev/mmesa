// backend/api/surveys/results.js
import { getResults } from '../../../controllers/surveyController.js';

export default async function handler(req, res) {
    if (req.method === 'GET') {
        await getResults(req, res);
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
