// routes/categoryRoutes.js

import Product from '../models/Product.js';
import Subcategory from '../models/subcategory.js';
import { generateRoute } from '../utils/routeFactory.js'

const router = generateRoute(Subcategory, Product);

export default router;
