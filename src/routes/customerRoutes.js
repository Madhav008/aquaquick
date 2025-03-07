const express = require("express");
const { getProfile, updateProfile, checkService } = require("../controllers/customerController");
const authMiddleware = require("../middlewares/authmiddleware");

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);
router.post("/check-service", checkService);

module.exports = router;
