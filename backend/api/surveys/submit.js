// backend/api/surveys/submit.js
import { submitSurvey } from '../../../controllers/surveyController.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        await submitSurvey(req, res);
    } else {
        res.status(405).json({ success: false, error: 'Method not allowed' });
    }
}
