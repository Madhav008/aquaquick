const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Order = require("./Order");

const OrderStatusHistory = sequelize.define("OrderStatusHistory", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  order_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: Order, key: "id" } },
  status: { type: DataTypes.STRING, allowNull: false },
  changed_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, { timestamps: false });

OrderStatusHistory.belongsTo(Order, { foreignKey: "order_id" });

module.exports = OrderStatusHistory;
