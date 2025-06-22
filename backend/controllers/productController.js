const Product = require('../models/productModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(400);
    res.json({ 
      message: 'Error fetching products', 
      error: error.message 
    });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      res.json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400);
    res.json({ 
      message: 'Error fetching product', 
      error: error.message 
    });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404);
      res.json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(400);
    res.json({ 
      message: 'Error deleting product', 
      error: error.message 
    });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const product = new Product({
      name: 'Sample Water',
      price: 0,
      user: req.user._id,
      image: '/images/sample.jpg',
      brand: 'Sample Brand',
      category: 'Water',
      countInStock: 0,
      description: 'Sample description',
      volume: 1,
      type: 'Mineral',
    });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400);
    res.json({ 
      message: 'Error creating product', 
      error: error.message 
    });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
      volume,
      type,
    } = req.body;

    const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;
    product.volume = volume || product.volume;
    product.type = type || product.type;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    res.json({ message: 'Product not found' });
  }
  } catch (error) {
    res.status(400);
    res.json({ 
      message: 'Error updating product', 
      error: error.message 
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};