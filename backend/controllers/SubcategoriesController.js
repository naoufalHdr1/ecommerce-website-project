// controllers/SubcategoriesController.js

import Product from '../models/Product.js';
import Subcategory from '../models/subcategory.js';
import BaseController from './BaseController.js';

class SubcategoriesController extends BaseController {
  constructor() {
    super(Subcategory);
  }

  /*
   * DELETE /subcategories/:id
   * Delete a subcategory.
   */
  static async delete(req, res) {
    const { id } = req.params;
    const { deleteProducts } = req.body

    try {
      const subcategory = Subcategory.findById(id);
      if (!subcategory) return res.status(404).json({ error: 'Subcategory not found' })
      if (deleteProducts) await Product.deleteMany({ subcategory_id: id });

      await Subcategory.findByIdAndDelete(id);
      return res.status(200).json({ message: 'Subcategory deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default SubcategoriesController;
