const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./Users");
const Product = require("./Product");

const Order = sequelize.define("orders", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } },
  product_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Product, key: "id" } },
  order_type: { type: DataTypes.ENUM("refill", "new"), allowNull: false },
  status: { 
    type: DataTypes.ENUM("pending", "assigned", "picked_up", "on_the_way", "delivered"), 
    defaultValue: "pending" 
  },
  assigned_to: { type: DataTypes.INTEGER, allowNull: true, references: { model: User, key: "id" } }
}, { timestamps: true });

Order.belongsTo(User, { foreignKey: "user_id", as: "customer" });
Order.belongsTo(User, { foreignKey: "assigned_to", as: "deliveryPartner" });
Order.belongsTo(Product, { foreignKey: "product_id" });

module.exports = Order;
