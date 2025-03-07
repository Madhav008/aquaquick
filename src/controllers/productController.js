const Product  = require("../models/Product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json(products);
  } catch (error) {
    console.log(error)
  }
};


exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock } = req.body;

    // Basic validation
    if (!name || !price || stock === undefined) {
      return res.status(400).json({ message: "Name, price, and stock are required." });
    }

    // Create a new product
    const product = await Product.create({
      name,
      description,
      price,
      stock,
    });

    res.status(201).json({ message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
