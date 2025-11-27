import pkg from 'pg';
import dotenv from 'dotenv';
import moduleCategories from '../../survey/src/data/data.js';

dotenv.config();
const { Pool } = pkg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT) || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

async function seedDatabase() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        console.log('💥 Clearing old survey data...');

        // Clear all survey related tables
        await client.query('TRUNCATE TABLE student_module_selections RESTART IDENTITY CASCADE');
        await client.query('TRUNCATE TABLE student_software_selections RESTART IDENTITY CASCADE');
        await client.query('TRUNCATE TABLE survey_responses RESTART IDENTITY CASCADE');
        await client.query('TRUNCATE TABLE students RESTART IDENTITY CASCADE');

        console.log('💥 Clearing modules...');
        await client.query('TRUNCATE TABLE modules RESTART IDENTITY CASCADE');

        console.log('📦 Seeding modules...');

        // Insert majors + submodules from your data.js
        for (const category of Object.values(moduleCategories)) {
            const major = category.major;

            await client.query(
                `INSERT INTO modules (id, category_id, name, is_major)
                 VALUES ($1, $2, $3, $4)`,
                [major.id, 1, major.name, true]
            );

            for (const sub of category.subModules) {
                await client.query(
                    `INSERT INTO modules (id, category_id, name, is_major, parent_id)
                     VALUES ($1, $2, $3, $4, $5)`,
                    [sub.id, 1, sub.name, false, sub.parentId]
                );
            }
        }

        // ✅ Add sample students
        //         console.log('📦 Seeding sample students...');
        // 
        //         const sampleStudents = [
        //             { email: 'agyapongrendosland53@gmail.com', index_number: '9209233049', year_of_study: 2, whatsapp_phone: '0292399334' },
        //             { email: 'student2@example.com', index_number: 'STU002', year_of_study: 1, whatsapp_phone: '0290000002' },
        //             { email: 'student3@example.com', index_number: 'STU003', year_of_study: 3, whatsapp_phone: '0290000003' },
        //         ];
        // 
        //         for (const student of sampleStudents) {
        //             await client.query(
        //                 `INSERT INTO students (email, index_number, year_of_study, whatsapp_phone) VALUES ($1, $2, $3, $4)`,
        //                 [student.email, student.index_number, student.year_of_study, student.whatsapp_phone]
        //             );
        //         }

        console.log('🎓 Sample students added.');
        console.log('🎉 Database fully reset and modules seeded. Ready for new surveys!');

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error seeding database:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seedDatabase();
