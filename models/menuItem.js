const pool = require("./index")

module.exports = {
  async createMenuItem(name, description = null, price, category) {
    const [result] = await pool.execute(
      "INSERT INTO MenuItems (id, name, description, price, category) VALUES (UUID(), ?, ?, ?, ?)",
      [name, description, price, category]
    );
    return result;
  },

  async getMenuItems(filterByCategory = null, sortByPrice = null) { // I could have resorted for stored procedures
    let query = "SELECT * FROM MenuItems";
    const params = [];
    if (filterByCategory) {
      query += " WHERE category = ?";
      params.push(filterByCategory);
    }
    if (sortByPrice) {
      query +=
        " ORDER BY price " +
        (sortByPrice.toLowerCase() === "desc" ? "DESC" : "ASC");
    }
    const [rows] = await pool.execute(query, params);
    return rows;
  },
 
  async getMenuItem(id) {
    const [rows] = await pool.execute("SELECT * FROM MenuItems WHERE id = ?", [
      id,
    ]);
    return rows.length > 0 ? rows[0] : null;
  },
};
