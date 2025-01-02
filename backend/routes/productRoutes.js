// routes/productRoutes.js

import Product from '../models/Product.js';
import Subcategory from '../models/subcategory.js';
import { generateRoute } from '../utils/routeFactory.js'

const router = generateRoute(Product, Subcategory);

export default router;
