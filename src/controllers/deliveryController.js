const { DeliveryPartner, Order } = require("../models/DeliveryPartner");


exports.getProfile = async (req, res) => {
  const partner = await DeliveryPartner.findOne({ where: { user_id: req.user.id } });
  res.json(partner);
};

exports.updateAvailability = async (req, res) => {
  const { available } = req.body;
  await DeliveryPartner.update({ available }, { where: { id: req.user.id } });
  res.json({ message: "Availability updated" });
};

exports.getAssignedOrders = async (req, res) => {
  const orders = await Order.findAll({ where: { assigned_to: req.user.id } });
  res.json(orders);
};

exports.updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  await Order.update({ status }, { where: { id: req.params.order_id, assigned_to: req.user.id } });
  res.json({ message: "Order status updated" });
};

exports.trackCustomerLocation = async (req, res) => {
  const order = await Order.findByPk(req.params.order_id);
  if (!order) return res.status(404).json({ message: "Order not found" });

  res.json({ latitude: order.latitude, longitude: order.longitude });
};
