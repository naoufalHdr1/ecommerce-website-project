// controllers/ProductsController.js

import Product from '../models/Product.js';

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
}

export default ProductsController;
