// backend/api/surveys/submit.js
import { submitSurvey } from '../../../controllers/surveyController.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', 'https://mmesa-client.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');

    if (req.method === 'OPTIONS') {
        return res.status(200).end(); // Preflight request
    }
    if (req.method === 'POST') {
        await submitSurvey(req, res);
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
