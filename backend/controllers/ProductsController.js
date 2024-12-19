// controllers/ProductsController.js

import Product from '../models/Product.js';
import mongoose from 'mongoose';

class ProductsController {

  /* Get all products */
  static async getAllProducts(req, res) {
    const { page = 0 } = req.query;
    const PAGE_SIZE = 20;

    try {
      // Retrieve all products with pagination
      const products = await Product.aggregate([
        { $skip: parseInt(page, 10) * PAGE_SIZE },
        { $limit: PAGE_SIZE },
      ]);

      return res.json(response);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

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
}

export default ProductsController;
