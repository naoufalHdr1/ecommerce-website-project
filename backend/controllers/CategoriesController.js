// controllers/CategoriesController.js

import Category from '../models/category.js';
import Subcategory from '../models/subcategory.js';
import BaseController from './BaseController.js';

class CategoriesController extends BaseController {
  constructor() {
    super(Category);
  }

  /*
   * DELETE /categories/:id
   * Delete a category.
   */
  static async delete(req, res) {
    const { id } = req.params;
    const { deleteSubcategories } = req.body

    try {
      const category = Category.findById(id);
      if (!category) return res.status(404).json({ error: 'Category not found' })
      if (deleteSubcategories) await Subcategory.deleteMany({ category_id: id });

      await Category.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Category deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default CategoriesController;
