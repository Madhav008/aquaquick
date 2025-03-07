'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
      // Users Table
      await queryInterface.createTable("users", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        phone: { type: Sequelize.STRING(20), allowNull: false, unique: true },
        full_name: { type: Sequelize.STRING(100) },
        role: { 
          type: Sequelize.ENUM("admin", "customer", "delivery_partner"), 
          allowNull: false, 
          defaultValue: "customer" 
        },
        address: { type: Sequelize.TEXT },
        latitude: { type: Sequelize.DECIMAL(10,7) },
        longitude: { type: Sequelize.DECIMAL(10,7) },
        service_available: { type: Sequelize.BOOLEAN, defaultValue: false },
        is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
        createdAt: {   // ✅ Use snake_case for PostgreSQL
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {   // ✅ Use snake_case for PostgreSQL
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
        });
  
      // Products Table
      await queryInterface.createTable("products", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: Sequelize.STRING(100), allowNull: false },
        description: { type: Sequelize.TEXT },
        price: { type: Sequelize.INTEGER, allowNull: false },
        createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      });
  
      // Orders Table
      await queryInterface.createTable("orders", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
        product_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "products", key: "id" } },
        order_type: { type: Sequelize.ENUM("refill", "new_filled"), allowNull: false },
        status: { type: Sequelize.ENUM("pending", "assigned", "picked_up", "delivered", "cancelled"), defaultValue: "pending" },
        security_deposit: { type: Sequelize.INTEGER, defaultValue: 0 },
        assigned_to: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
        delivery_latitude: { type: Sequelize.DECIMAL(10,7) },
        delivery_longitude: { type: Sequelize.DECIMAL(10,7) },
        estimated_delivery_time: { type: Sequelize.DATE },
        payment_method: { type: Sequelize.ENUM("COD"), defaultValue: "COD" },
        createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      });
  
      // Order Status History Table
      await queryInterface.createTable("order_status_history", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        order_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "orders", key: "id" } },
        status: { type: Sequelize.ENUM("pending", "assigned", "picked_up", "delivered", "cancelled"), allowNull: false },
        changed_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        note: { type: Sequelize.TEXT }
      });
  
      // Delivery Partner Locations Table
      await queryInterface.createTable("delivery_partner_locations", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        delivery_partner_id: { type: Sequelize.INTEGER, allowNull: false, references: { model: "users", key: "id" } },
        latitude: { type: Sequelize.DECIMAL(10,7), allowNull: false },
        longitude: { type: Sequelize.DECIMAL(10,7), allowNull: false },
        updatedAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      });
  
      // Transactions Table
      await queryInterface.createTable("transactions", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        order_id: { type: Sequelize.INTEGER, references: { model: "orders", key: "id" } },
        user_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
        amount: { type: Sequelize.INTEGER, allowNull: false },
        transaction_type: { type: Sequelize.ENUM("COD Payment", "Security Deposit", "Refund"), allowNull: false },
        status: { type: Sequelize.ENUM("pending", "completed", "failed"), defaultValue: "pending" },
        transaction_date: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
        note: { type: Sequelize.TEXT }
      });
  
      // System Logs Table
      await queryInterface.createTable("system_logs", {
        id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
        user_id: { type: Sequelize.INTEGER, references: { model: "users", key: "id" } },
        action: { type: Sequelize.TEXT, allowNull: false },
        createdAt: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
      });
    },
  

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("system_logs");
    await queryInterface.dropTable("transactions");
    await queryInterface.dropTable("delivery_partner_locations");
    await queryInterface.dropTable("order_status_history");
    await queryInterface.dropTable("orders");
    await queryInterface.dropTable("products");
    await queryInterface.dropTable("users");
  }
};




