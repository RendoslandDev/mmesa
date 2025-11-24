import { execute } from '../config/database.js';

class Student {
    static async create(email, indexNumber, year, phoneNumber) {
        const [result] = await execute(
            'INSERT INTO students (email, index_number, year_of_study, phone_number) VALUES (?, ?, ?, ?)',
            [email, indexNumber, year, phoneNumber]
        );
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await execute(
            'SELECT * FROM students WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    static async findById(studentId) {
        const [rows] = await execute(
            'SELECT * FROM students WHERE student_id = ?',
            [studentId]
        );
        return rows[0];
    }

    static async getAll() {
        const [rows] = await execute('SELECT * FROM students');
        return rows;
    }
}

export default Student;
export const getAll = Student.getAll;
export const getByYear = Student.getByYear;
export const findById = Student.findById;
export const findByEmail = Student.findByEmail;


