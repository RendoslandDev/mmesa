const studentService = {
    // Get all students (PROTECTED)
    getAllStudents: async (token, limit = 100, offset = 0) => {
        const query = `?limit=${limit}&offset=${offset}`;
        return await apiCall(`/students${query}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    // Get student by ID (PROTECTED)
    getStudent: async (token, studentId) => {
        return await apiCall(`/students/${studentId}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    // Get student by email (PROTECTED)
    getStudentByEmail: async (token, email) => {
        return await apiCall(`/students/email/${encodeURIComponent(email)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    // Get students by year (PROTECTED)
    getStudentsByYear: async (token, year) => {
        return await apiCall(`/students/year/${encodeURIComponent(year)}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },

    // Get student statistics (PROTECTED)
    getStudentStats: async (token) => {
        return await apiCall('/students/stats', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
    },
};

export default studentService;