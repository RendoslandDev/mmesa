import express from 'express';
import * as surveyController from '../controllers/surveyController.js';


const router = express.Router();



router.get('/modules', surveyController.getModules);
router.get('/software', surveyController.getSoftware);

router.post('/submit', surveyController.submitSurvey);
router.get('/results', surveyController.getResults);
router.get('/statistics', surveyController.getStatistics);
router.get('/report', surveyController.getReport);

export default router;









