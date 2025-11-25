import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import routes
import surveysRoutes from './routes/surveys.js';
import adminRoutes from './routes/admin.js';
import studentsRoutes from './routes/students.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const allowedOrigins = [
    'http://localhost:5173', // local dev
    'https://mmesa-survey.onrender.com' // production frontend
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
};

app.use(cors(corsOptions));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/surveys', surveysRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentsRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Server is running',
        timestamp: new Date(),
        environment: process.env.NODE_ENV,
        corsOrigin: corsOptions.origin
    });
});
app.get('/', (req, res) => {
    res.send('✅ Backend is live!');
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ success: false, error: 'Route not found' });
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        error: err.message || 'Internal server error'
    });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log('\n✅ ==================== SERVER STARTED ====================');
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📋 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('🌐 Allowed origins:', allowedOrigins);
    console.log(`🔧 CORS Enabled: true`);
    console.log(`📍 Base URL: http://localhost:${PORT}`);
    console.log('=========================================================\n');

    console.log('📌 Available Endpoints:');
    console.log('   POST   /api/surveys/submit');
    console.log('   GET    /api/surveys/results');
    console.log('   GET    /api/surveys/statistics');
    console.log('   POST   /api/admin/login');
    console.log('   GET    /api/admin/stats');
    console.log('   GET    /api/admin/export');
    console.log('   GET    /api/health\n');
});



export default app;