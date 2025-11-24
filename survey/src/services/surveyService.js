import { apiCall } from './api.js';

export const surveyService = {
    // Submit survey (PUBLIC)
    submitSurvey: async (surveyData) => {
        return await apiCall('/surveys/submit', {
            method: 'POST',
            body: JSON.stringify(surveyData),
        });
    },

    // Get all results (PUBLIC)
    getAllResults: async (limit = 100, offset = 0) => {
        const query = `?limit=${limit}&offset=${offset}`;
        return await apiCall(`/surveys/results${query}`);
    },

    // Get statistics (PUBLIC)
    getStatistics: async () => {
        return await apiCall('/surveys/statistics');
    },

    // Get detailed report (PUBLIC)
    getDetailedReport: async (option = null, year = null) => {
        const params = new URLSearchParams();
        if (option) params.append('option', option);
        if (year) params.append('year', year);
        const query = params.toString() ? `?${params.toString()}` : '';
        return await apiCall(`/surveys/report${query}`);
    },
};
export default surveyService;