const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Product = sequelize.define("products", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false }
}, { timestamps: true });

module.exports = Product;
