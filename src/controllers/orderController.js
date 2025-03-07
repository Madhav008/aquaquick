const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
  try {
    const { product_id, order_type, security_deposit } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized: User ID missing" });
    }

    // Create a new order
    const order = await Order.create({
      user_id: req.user.id, // Updated from customer_id to user_id to match the table schema
      product_id,
      order_type,
      security_deposit: security_deposit || 0, // Default to 0 if not provided
      status: "pending",
    });

    res.status(201).json({ order_id: order.id, status: order.status });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getOrders = async (req, res) => {
  const orders = await Order.findAll({ where: { user_id: req.user.id } });
  res.json(orders);
};


exports.getOrderDetails = async (req, res) => {
  try {
    // Extract order ID from request parameters
    const { order_id } = req.params;

    // Validate order_id (ensure it's a number)
    if (isNaN(order_id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    // Fetch order using where condition
    const order = await Order.findOne({
      where: { id: order_id }
    });
    // Handle case where order is not found
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return order details
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
