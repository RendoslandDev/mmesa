import pkg from 'pg';
import dotenv from 'dotenv';
import moduleCategories from '../../survey/src/data/data.js'; // adjust path if needed

dotenv.config();
const { Pool } = pkg;

// Create a pool using environment variables
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

        console.log('💥 Clearing survey data...');

        // Clear dependent tables first
        await client.query('TRUNCATE TABLE student_module_selections RESTART IDENTITY CASCADE');
        await client.query('TRUNCATE TABLE student_software_selections RESTART IDENTITY CASCADE');
        await client.query('TRUNCATE TABLE survey_responses RESTART IDENTITY CASCADE');
        await client.query('TRUNCATE TABLE students RESTART IDENTITY CASCADE');

        console.log('💥 Clearing modules table...');
        await client.query('TRUNCATE TABLE modules RESTART IDENTITY CASCADE');
        console.log('✅ All relevant tables cleared');

        // Insert majors and submodules
        for (const category of Object.values(moduleCategories)) {
            const major = category.major;

            // Insert major
            await client.query(
                `INSERT INTO modules (id, category_id, name, is_major) VALUES ($1, $2, $3, $4)`,
                [major.id, 1, major.name, true] // adjust category_id mapping if needed
            );

            // Insert submodules
            for (const sub of category.subModules) {
                await client.query(
                    `INSERT INTO modules (id, category_id, name, is_major, parent_id) VALUES ($1, $2, $3, $4, $5)`,
                    [sub.id, 1, sub.name, false, sub.parentId]
                );
            }
        }

        console.log('💥 Seeding sample students...');
        // Insert some sample students
        const sampleStudents = [
            { email: 'student1@example.com', index_number: 'STU001', year_of_study: 1, whatsapp_phone: '+233500000001' },
            { email: 'student2@example.com', index_number: 'STU002', year_of_study: 2, whatsapp_phone: '+233500000002' },
            { email: 'student3@example.com', index_number: 'STU003', year_of_study: 3, whatsapp_phone: '+233500000003' },
        ];

        for (const student of sampleStudents) {
            await client.query(
                `INSERT INTO students (email, index_number, year_of_study, whatsapp_phone) VALUES ($1, $2, $3, $4)`,
                [student.email, student.index_number, student.year_of_study, student.whatsapp_phone]
            );
        }

        await client.query('COMMIT');
        console.log('🎉 Database seeded successfully with modules and sample students! Ready for new survey entries.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('❌ Error seeding database:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

// Run the seed script
seedDatabase();
