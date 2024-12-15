const pool = require("./index")

module.exports = {
  async addItemToOrder(orderId, menuItemId, quantity) {
    const [result] = await pool.execute(
      "INSERT INTO OrderItems (id, orderId, menuItemId, quantity) VALUES (UUID(), ?, ?, ?)",
      [orderId, menuItemId, quantity]
    );
    return result;
  },

  async getItemsByOrderId(orderId) {
    const [rows] = await pool.execute(
      "SELECT * FROM OrderItems WHERE orderId = ?",
      [orderId]
    );
    return rows;
  },
};
