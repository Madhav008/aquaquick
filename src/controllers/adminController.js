const { Order, DeliveryPartner } = require("../models/Order");
const User = require("../models/Users");

exports.getDashboardStats = async (req, res) => {
  const totalOrders = await Order.count();
  const activeDeliveries = await Order.count({ where: { status: "assigned" } });
  const totalDeliveryPartners = await DeliveryPartner.count();
  const pendingOrders = await Order.count({ where: { status: "pending" } });

  res.json({ total_orders: totalOrders, active_deliveries: activeDeliveries, total_delivery_partners: totalDeliveryPartners, pending_orders: pendingOrders });
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.findAll();
  res.json(orders);
};

exports.assignOrder = async (req, res) => {
  const { delivery_partner_id } = req.body;
  await Order.update({ assigned_to: delivery_partner_id, status: "assigned" }, { where: { id: req.params.order_id } });
  res.json({ message: "Order assigned" });
};

exports.getOrderHistory = async (req, res) => {
  const order = await Order.findByPk(req.params.order_id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json(order.statusHistory);
};

exports.getAllDeliveryPartners = async (req, res) => {
  const partners = await DeliveryPartner.findAll();
  res.json(partners);
};


exports.createDeliveryPartner = async (req, res) => {
  try {
    const { user_id } = req.body;

    // Check if user exists and has the correct role
    const user = await User.findOne({ where: { user_id: user_id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (user.role !== "delivery_partner") {
      return res.status(400).json({ error: "User must be a delivery partner" });
    }

    // Create delivery partner entry
    const partner = await DeliveryPartner.create({ user_id });
    res.status(201).json(partner);

  } catch (error) {
    console.error("Error creating delivery partner:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


exports.deleteDeliveryPartner = async (req, res) => {
  await DeliveryPartner.destroy({ where: { id: req.params.id } });
  res.json({ message: "Delivery Partner removed" });
};
