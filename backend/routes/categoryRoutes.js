// routes/categoryRoutes.js

import Category from '../models/category.js';
import Subcategory from '../models/subcategory.js';
import { generateRoute } from '../utils/routeFactory.js'

const router = generateRoute(Category);

export default router;
