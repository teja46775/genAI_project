const pool = require('./config/database');

async function testSubscriptions() {
  try {
    const query = `
      SELECT s.id, s.user_id, s.plan_name, s.plan_type, s.price, s.status, 
             s.start_date, s.end_date, s.created_at,
             u.email, u.first_name, u.last_name 
      FROM subscriptions s 
      JOIN users u ON s.user_id = u.id
      ORDER BY s.created_at DESC
    `;
    
    const result = await pool.query(query);
    console.log('Total subscriptions:', result.rows.length);
    console.log('Raw data:');
    result.rows.forEach((row, index) => {
      console.log(`Row ${index + 1}:`, JSON.stringify(row, null, 2));
    });
    
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
  }
}

testSubscriptions();