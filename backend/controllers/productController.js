const asynchandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc Get all products
// @route GET /api/products
// @access Public
const getProducts = asynchandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

// @desc Get a single product by ID
// @route GET /api/products/:id
// @access Public
const getProductById = asynchandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc Create a new product
// @route POST /api/products
// @access Private (Admin only)
const createProduct = asynchandler(async (req, res) => {
    const { name, description, price, stock, image, category, brand } = req.body;

    const product = new Product({
        name,
        description,
        price,
        stock,
        image,
        category,
        brand,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
})

// @desc Update a product
// @route PUT /api/products/:id
// @access Private (Admin only)
const updateProduct = asynchandler(async (req, res) => {
    const { name, description, price, stock, image, category, brand } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.image = image || product.image;
        product.category = category || product.category;
        product.brand = brand || product.brand;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

// @desc Delete a product
// @route DELETE /api/products/:id
// @access Private (Admin only)
const deleteProduct = asynchandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};