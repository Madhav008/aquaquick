const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ServiceAvailability = sequelize.define("ServiceAvailability", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  latitude: { type: DataTypes.FLOAT, allowNull: false },
  longitude: { type: DataTypes.FLOAT, allowNull: false },
  service_available: { type: DataTypes.BOOLEAN, defaultValue: true }
}, { timestamps: true });

module.exports = ServiceAvailability;
