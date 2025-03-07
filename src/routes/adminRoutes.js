const express = require("express");
const { getDashboardStats, getAllOrders, assignOrder, getOrderHistory, getAllDeliveryPartners, createDeliveryPartner, deleteDeliveryPartner } = require("../controllers/adminController");
const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, getDashboardStats);
router.get("/orders", authMiddleware, getAllOrders);
router.put("/orders/:order_id/assign", authMiddleware, assignOrder);
router.get("/orders/:order_id/history", authMiddleware, getOrderHistory);
router.get("/delivery-partners", authMiddleware, getAllDeliveryPartners);
router.post("/delivery-partners", authMiddleware, createDeliveryPartner);
router.delete("/delivery-partners/:id", authMiddleware, deleteDeliveryPartner);

module.exports = router;
