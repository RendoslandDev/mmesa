import { apiCall } from './api.js';

const adminService = {
    login: async (username, password) => {
        return await apiCall('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    },

    getStats: async (token) => {
        try {
            return await apiCall('/admin/stats', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (err) {
            console.error('Error fetching admin stats:', err);
            throw err;
        }
    },

    exportToCSV: async (token) => {
        try {
            // CSV request must NOT parse JSON
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/admin/export`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const errText = await res.text().catch(() => null);
                throw new Error(errText || `HTTP error! ${res.status}`);
            }

            return await res.blob();
        } catch (err) {
            console.error('Error exporting CSV:', err);
            throw err;
        }
    },
};

export default adminService;
