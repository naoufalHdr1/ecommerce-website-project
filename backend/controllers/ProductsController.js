// controllers/ProductsController.js

import Product from '../models/Product.js';
import mongoose from 'mongoose';

class ProductsController {

  /* Get all products */
  static async getProducts(req, res) {
    try {
      const products = await Product.find();
      return res.json(products);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async getProductById(req, res) {
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
