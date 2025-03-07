// Import required dependencies
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { Sequelize } = require("sequelize");

// Import route files
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const orderRoutes = require("./routes/orderRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productRoutes = require("./routes/productRoutes");

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Database Connection
const sequelize = new Sequelize(process.env.DB_URL, { dialect: "postgres" });

sequelize.authenticate()
  .then(() => console.log("✅ Connected to PostgreSQL"))
  .catch((err) => console.error("❌ DB Connection Error: ", err));

// Define API Routes
app.use("/auth", authRoutes);
app.use("/customers", customerRoutes);
app.use("/orders", orderRoutes);
app.use("/delivery-partners", deliveryRoutes);
app.use("/admin", adminRoutes);
app.use("/products", productRoutes);

// Set up the server to listen on PORT
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

