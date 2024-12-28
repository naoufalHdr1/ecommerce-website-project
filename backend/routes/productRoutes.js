// routes/productRoutes.js

import Product from '../models/Product.js';
import { generateRoute } from '../utils/routeFactory.js'

const router = generateRoute(Product);

export default router;
