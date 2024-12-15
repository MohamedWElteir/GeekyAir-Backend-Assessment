require("dotenv").config();
const app = require("./app"); 
const pool = require("./models/index");
const cron = require("node-cron");
const updateExpiredOrders = require("./jobs/updateExpiredOrders");

const PORT = process.env.PORT || 3000;
cron.schedule("0 * * * *", async () => { // Run the task at the start of every hour.
  console.log("Running cron job to update expired orders...");
   try {
    await updateExpiredOrders();
    console.log("Expired orders updated successfully.");
  } catch (err) {
    console.error("Error updating expired orders:", err.message);
  }
});

(async () => {
  try {
    
    await pool.query("SELECT 1");
    console.log("Database connected successfully.");

   
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Unable to connect to the database:", err.message);
  }
})();

