const  Customer  = require("../models/Users");

exports.getProfile = async (req, res) => {
  const customer = await Customer.findByPk(req.user.id);
  res.json(customer);
};

exports.updateProfile = async (req, res) => {
  const { full_name, address, latitude, longitude } = req.body;
  await Customer.update({ full_name, address, latitude, longitude }, { where: { id: req.user.id } });
  res.json({ message: "Profile updated" });
};

exports.checkService = async (req, res) => {
  const { latitude, longitude } = req.body;
  
  // Assume service is available within a specific range
  const serviceAvailable = latitude > 10 && latitude < 50 && longitude > 10 && longitude < 50;

  res.json({ service_available: serviceAvailable });
};
