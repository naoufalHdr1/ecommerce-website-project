// routes/categoryRoutes.js

import Product from '../models/Product.js';
import Subcategory from '../models/subcategory.js';
import Category from '../models/category.js';
import { generateRoute } from '../utils/routeFactory.js'

const router = generateRoute(Subcategory, Category);

export default router;
