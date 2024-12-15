const pool = require("./index")

module.exports = {
  async createOrder(userId) {
    const [result] = await pool.execute(
      "INSERT INTO Orders (id, userId, status) VALUES (UUID(), ?, ?)",
      [userId, "pending"]
    );
    return result;
  },

  async getOrderById(orderId) {
    const [rows] = await pool.execute("SELECT * FROM Orders WHERE id = ?", [
      orderId,
    ]);
    return rows[0];
  },
  async getAllOrders() {
    const [rows] = await pool.execute("SELECT * FROM Orders")
    return rows[0];
  }
};
