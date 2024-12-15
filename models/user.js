const pool = require("./index")

module.exports = {
  async createUser(username, passwordHash, phoneNumber, role) {
    const [result] = await pool.execute(
      "INSERT INTO Users (id, username, passwordHash, phoneNumber, role) VALUES (UUID(), ?, ?, ?, ?)",
      [username, passwordHash, phoneNumber, role]
    );
    return result;
  },

  async findUserById(id) {
    const [rows] = await pool.execute("SELECT * FROM Users WHERE id = ?", [id]);
    return rows[0];
  },

  async findUserByUsername(username) {
    const [rows] = await pool.execute(
      "SELECT * FROM Users WHERE username = ?",
      [username]
    );
    return rows[0];
  },

  async findUserByPhoneNumber(phoneNumber) {
    const [rows] = await pool.execute(
      "SELECT * FROM Users WHERE phoneNumber = ?",
      [phoneNumber]
    );
    return rows[0];
  },

  async findUserByResetToken(resetToken) {
    const [rows] = await pool.execute(
      "SELECT * FROM Users WHERE resetToken = ? AND resetTokenExpiry > NOW()",
      [resetToken]
    );
    return rows[0];
  },

  async saveResetToken(userId, resetToken, resetTokenExpiry) {
    await pool.execute(
      "UPDATE Users SET resetToken = ?, resetTokenExpiry = ? WHERE id = ?",
      [resetToken, resetTokenExpiry, userId]
    );
  },

  async updatePassword(userId, hashedPassword) {
    await pool.execute(
      "UPDATE Users SET passwordHash = ?, resetToken = NULL, resetTokenExpiry = NULL WHERE id = ?",
      [hashedPassword, userId]
    );
  },
};
