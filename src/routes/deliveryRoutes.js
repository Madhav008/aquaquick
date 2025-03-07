const express = require("express");
const { getProfile, updateAvailability, getAssignedOrders, updateOrderStatus, trackCustomerLocation } = require("../controllers/deliveryController");
const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.put("/me/availability", authMiddleware, updateAvailability);
router.get("/orders", authMiddleware, getAssignedOrders);
router.put("/orders/:order_id/status", authMiddleware, updateOrderStatus);
router.get("/orders/:order_id/location", authMiddleware, trackCustomerLocation);

module.exports = router;
