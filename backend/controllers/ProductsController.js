// controllers/ProductsController.js

import Product from '../models/Product.js';
import BaseController from './BaseController.js';

class ProductsController extends BaseController {
  constructor() {
    super(Product);
  }
}

export default ProductsController;
