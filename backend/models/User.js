const pool = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { email, password, firstName, lastName, phone } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const query = `
      INSERT INTO users (email, password, first_name, last_name, phone, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, email, first_name, last_name, phone, created_at
    `;
    
    const result = await pool.query(query, [email, hashedPassword, firstName, lastName, phone]);
    return result.rows[0];
  }

  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      console.error('Database error in findByEmail:', error);
      throw error;
    }
  }

  static async findById(id) {
    const query = 'SELECT id, email, first_name, last_name, phone, created_at FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = User;