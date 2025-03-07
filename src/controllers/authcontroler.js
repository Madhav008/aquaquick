const jwt = require("jsonwebtoken");
const User = require("../models/Users");
require("dotenv").config();

// Mock OTP sending function
const sendOTP = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone number required" });

  // Assume OTP is always 123456 for simplicity
  res.json({ message: "OTP sent successfully", otp: "123456" });
};

// Verify OTP & Login
const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;
  if (otp !== "123456") return res.status(400).json({ message: "Invalid OTP" });

  let user = await User.findOne({ where: { phone } });
  if (!user) {
    user = await User.create({ phone });
  }

  const token = jwt.sign({ id: user.id, phone: user.phone, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, role: user.role });
};

module.exports = { sendOTP, verifyOTP };
