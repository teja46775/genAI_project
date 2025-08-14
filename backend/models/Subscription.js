const pool = require('../config/database');

class Subscription {
  static async create(subscriptionData) {
    console.log('Creating subscription with data:', subscriptionData);
    const { userId, planName, planType, price, status, startDate, endDate } = subscriptionData;
    
    const query = `
      INSERT INTO subscriptions (user_id, plan_name, plan_type, price, status, start_date, end_date, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;
    
    console.log('Query params:', [userId, planName, planType, price, status, startDate, endDate]);
    const result = await pool.query(query, [userId, planName, planType, price, status, startDate, endDate]);
    return result.rows[0];
  }

  static async findAll(filters = {}) {
    let query = `
      SELECT s.id, s.user_id, s.plan_name, s.plan_type, s.price, s.status, 
             s.start_date, s.end_date, s.created_at,
             u.email, u.first_name, u.last_name 
      FROM subscriptions s 
      JOIN users u ON s.user_id = u.id
    `;
    const params = [];
    const conditions = [];

    if (filters.status) {
      conditions.push(`s.status = $${params.length + 1}`);
      params.push(filters.status);
    }

    if (filters.planType) {
      conditions.push(`s.plan_type = $${params.length + 1}`);
      params.push(filters.planType);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY s.created_at DESC';

    console.log('Executing query:', query);
    const result = await pool.query(query, params);
    console.log('Query result count:', result.rows.length);
    if (result.rows.length > 0) {
      console.log('First row:', JSON.stringify(result.rows[0], null, 2));
    }
    return result.rows;
  }

  static async findById(id) {
    const query = `
      SELECT s.*, u.email, u.first_name, u.last_name 
      FROM subscriptions s 
      JOIN users u ON s.user_id = u.id 
      WHERE s.id = $1
    `;
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, updateData) {
    const { planName, planType, price, status, endDate } = updateData;
    
    const query = `
      UPDATE subscriptions 
      SET plan_name = $1, plan_type = $2, price = $3, status = $4, end_date = $5, updated_at = NOW()
      WHERE id = $6
      RETURNING *
    `;
    
    const result = await pool.query(query, [planName, planType, price, status, endDate, id]);
    return result.rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM subscriptions WHERE id = $1 RETURNING *';
    const result = await pool.query(query, [id]);
    return result.rows[0];
  }
}

module.exports = Subscription;