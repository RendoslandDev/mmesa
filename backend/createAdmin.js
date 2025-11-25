import bcrypt from 'bcryptjs';
import { query } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function createOrUpdateAdmin() {
    try {
        const username = process.env.ADMIN_USERNAME || 'admin';
        const password = process.env.ADMIN_PASSWORD || 'admin123';
        const role = 'admin';

        const hashedPassword = await bcrypt.hash(password, 10);

        const admins = await query(
            'SELECT * FROM admin_users WHERE username = $1 LIMIT 1',
            [username]
        );

        if (admins.length > 0) {
            await query(
                'UPDATE admin_users SET password_hash = $1 WHERE username = $2',
                [hashedPassword, username]
            );
            console.log(`Admin "${username}" exists → password updated.`);
        } else {
            await query(
                'INSERT INTO admin_users (username, password_hash, role) VALUES ($1, $2, $3)',
                [username, hashedPassword, role]
            );
            console.log(`Admin "${username}" created.`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

createOrUpdateAdmin();
