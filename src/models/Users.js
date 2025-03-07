const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = sequelize.define("users", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  full_name: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM("customer", "admin", "delivery_partner"), defaultValue: "customer" }
}, { timestamps: true });

module.exports = User;