// backend/api/surveys/statistics.js
import { getStatistics } from '../../../controllers/surveyController.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://mmesa-client.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Preflight request
    }
    if (req.method === 'GET') {
        await getStatistics(req, res);
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
