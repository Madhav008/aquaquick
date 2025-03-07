const express = require("express");
const { placeOrder, getOrders, getOrderDetails } = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

router.post("/", authMiddleware, placeOrder);
router.get("/", authMiddleware, getOrders);
router.get("/:order_id", authMiddleware, getOrderDetails);

module.exports = router;
