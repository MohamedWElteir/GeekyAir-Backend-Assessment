const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const ratelimit = require("express-rate-limit");
const swaggerUI = require("swagger-ui-express");
const swaggerSpec = require("./swaggerConfig");
const swaggerUiDist = require("swagger-ui-dist");


const app = express();

const auth_limit = ratelimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  limit: 100
})

const order_limit = ratelimit({
  windowMs: 20 * 60 * 1000,  // 20 mins
  limit: 200
})

app.use(bodyParser.json());


app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
app.use("/auth", auth_limit, authRoutes);
app.use("/menu", menuRoutes);
app.use("/orders", order_limit, orderRoutes);

app.get("/test", (req, res) => {
  res.status(200).json({ message: "working" });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Internal server error", error: err.message });
});

module.exports = app;

