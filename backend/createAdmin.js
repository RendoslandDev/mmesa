import bcrypt from 'bcryptjs';
import { query } from './config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function createOrUpdateAdmin() {
    try {
        const username = process.env.ADMIN_USERNAME || 'admin';
        const password = process.env.ADMIN_PASSWORD || 'admin123';
        const role = 'admin';

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if admin already exists
        const admins = await query('SELECT * FROM admin_users WHERE username = ? LIMIT 1', [username]);

        if (admins.length > 0) {
            // Update password if admin exists
            await query('UPDATE admin_users SET password_hash = ? WHERE username = ?', [hashedPassword, username]);
            console.log(`Admin user "${username}" already exists. Password updated.`);
        } else {
            // Insert new admin
            await query('INSERT INTO admin_users (username, password_hash, role) VALUES (?, ?, ?)', [username, hashedPassword, role]);
            console.log(`Admin user "${username}" created successfully.`);
        }

        process.exit(0);
    } catch (error) {
        console.error('Error creating/updating admin:', error);
        process.exit(1);
    }
}

createOrUpdateAdmin();
