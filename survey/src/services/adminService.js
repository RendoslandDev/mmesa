
import { apiCall } from './api.js';

const adminService = {
    login: async (username, password) => {
        return await apiCall('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
    },

    getStats: async (token) => {
        const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        };

        try {
            const resp = await fetch('/api/admin/stats', { headers });
            if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
            return await resp.json();
        } catch (err) {
            console.error('Error fetching admin stats:', err);
            throw err;
        }
    },

    exportToCSV: async (token) => {
        try {
            const resp = await fetch('/api/admin/export', {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!resp.ok) throw new Error(`HTTP error! status: ${resp.status}`);
            return await resp.blob(); // blob for CSV
        } catch (err) {
            console.error('Error exporting CSV:', err);
            throw err;
        }
    },

};

export default adminService;
