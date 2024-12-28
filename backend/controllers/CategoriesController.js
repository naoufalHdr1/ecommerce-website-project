// controllers/ProductsController.js

import Category from '../models/category.js';
import mongoose from 'mongoose';

class CategoriesController {

  /*
   * GET /categories
   * Retrieve a list of categories.
   */
  static async getAllCategories(req, res) {
    const { page = 0 } = req.query;
    const PAGE_SIZE = 20;

    try {
      const categories = await Product.aggregate([
        { $skip: parseInt(page, 10) * PAGE_SIZE },
        { $limit: PAGE_SIZE },
      ]);

      return res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /* 
   * GET /products/:id
   * Retrieve details of a specific product.
   */
  static async getProduct(req, res) {
    const productId = req.params.id;

    try {
      // Check if the product exists
      const product = await Product.findById(productId);
      if (!product) return res.status(404).json({ error: 'Product not found'});

      return res.json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /* 
   * POST /products
   * Add a new product
   */
  static async createProduct(req, res) {
    const { name, description, price, stock, image } = req.body;

    try {
      // Create and save a new user
      const product = new Product({ name, description, price, stock, image });
      await product.save();

      return res.status(201).json(product);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /*
   * PUT /products/:id
   * Update product information
   */
  static async updateProduct(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    try {
      // Check if the product exists
      const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, {
        new: true,
        runValidators: true,
      });
      if (!updatedProduct)
        return res.status(404).json({ error: 'Product not found'});

      return res.json(updatedProduct);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  /*
   * DELETE /products/:id
   * Remove a product.
   */
  static async deleteProduct(req, res) {
    const { id } = req.params;

    try {
      const deletedProduct = await Product.findByIdAndDelete(id);
      if (!deletedProduct)
        return res.status(404).json({ error: 'Product not found'});

      return res.status(200).json({});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default ProductsController;
