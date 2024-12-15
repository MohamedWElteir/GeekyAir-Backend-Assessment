const pool = require("../models/index"); 

const updateExpiredOrders = async () => {
  try {
    const [result] = await pool.execute(`
            UPDATE Orders
            SET status = 'expired'
            WHERE status = 'pending' AND TIMESTAMPDIFF(HOUR, createdAt, NOW()) >= 4
        `);

      console.log(`${result.affectedRows} orders expired.`);
      
  } catch (err) {
    console.error("Error updating expired orders:", err.message);
  }
};

module.exports = updateExpiredOrders;
