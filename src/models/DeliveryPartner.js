const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./Users");

const DeliveryPartner = sequelize.define("delivery_partners", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: "id" } },
  available: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true });

DeliveryPartner.belongsTo(User, { foreignKey: "user_id" });

module.exports = DeliveryPartner;
