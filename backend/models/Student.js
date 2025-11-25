// models/Student.js
import { query } from '../config/database.js';

class Student {
    static async create(email, indexNumber, yearOfStudy, whatsappPhone) {
        const result = await query(
            `INSERT INTO students (email, index_number, year_of_study, whatsapp_phone)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
            [email, indexNumber, yearOfStudy, whatsappPhone]
        );
        return result[0]?.id;
    }

    static async findByEmail(email) {
        const rows = await query(
            `SELECT * FROM students WHERE email = $1`,
            [email]
        );
        return rows[0] || null;
    }

    static async findById(studentId) {
        const rows = await query(
            `SELECT * FROM students WHERE id = $1`,
            [studentId]
        );
        return rows[0] || null;
    }

    static async getAll() {
        return await query(`SELECT * FROM students ORDER BY created_at DESC`);
    }

    static async getByYear(yearOfStudy) {
        return await query(
            `SELECT * FROM students WHERE year_of_study = $1 ORDER BY created_at DESC`,
            [yearOfStudy]
        );
    }
}

export default Student;
export const getAll = Student.getAll;
export const getByYear = Student.getByYear;
export const findById = Student.findById;
export const findByEmail = Student.findByEmail;
