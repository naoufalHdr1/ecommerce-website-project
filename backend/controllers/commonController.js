import { checkDocumentExists } from '../utils/helper.js';
import Subcategory from '../models/subcategory.js';
import Category from '../models/category.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';

// Add a new item.
export const create = (model) => async (req, res) => {
  try {
    const data = await model.create(req.body);
    res.status(201).json(data);
  } catch (err) {
	  console.log(err)
    res.status(500).json({ error: err.message });
  }
};

// Retrieve a list of items (with pagination).
export const getAll = (model) => async (req, res) => {
  const { page = 0 } = req.query;
  const PAGE_SIZE = 20;
  
  try {
    const items = await model.aggregate([
      { $skip: parseInt(page, 10) * PAGE_SIZE },
      { $limit: PAGE_SIZE },
    ]);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve details of a specific item by Id.
export const getById = (model) => async (req, res) => {
  const { id } = req.params;

  try {
    const data = await model.findById(id);
    if (!data) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Retrieve items by query parameters
export const getByQuery = (model) => async (req, res) => {
  const query = req.query;

  try {
    const data = await model.find(query);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateById = (model) => async (req, res) => {
  const { id } = req.params;

  try {
    // Use $set to update fields explicitly
    const updatedItem = await model.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* Update an item by Id
export const updateById = (model) => async (req, res) => {
  const { id } = req.params;

  try {
    const updatedItem = await model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedItem) return res.status(404).json({ error: 'Item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
*/

export const updateProductById = (model) => async (req, res) => {
  const { id } = req.params;
  const {subcategory_id, ...updateData } = req.body;
  let subcategory = null;

  try {
    const existingProduct = await model.findById(id);
    if (!existingProduct) return res.status(404).json({ error: "Product not found" });

    // Check if subcategory exist
    try {
      if (subcategory_id) {
        subcategory = await checkDocumentExists(Subcategory, subcategory_id, 'subcategory_id')
      }
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }

    // Handle subcategory change
    if (existingProduct.subcategory_id !== subcategory_id) {
      await Subcategory.updateOne(
        { _id: existingProduct.subcategory_id },
        { $pull: { products: id } },
      );
    }

    if (subcategory_id) {
      await Subcategory.updateOne(
        { _id: subcategory_id },
        { $addToSet: { products: id } },
      );
    }

    // Update the product
    const updatedProduct = await model.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true,}
    );

    res.json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: 'Error updating item' });
  }
}

export const updateListFieldById = (model) => async (req, res) => {
  const { id } = req.params;
  const { operation, data } = req.body
  let updatedSubcategory;

  try {
    if (operation === 'push') {
      updatedSubcategory = await model.findByIdAndUpdate(
        id,
        { $push: data },
        { new: true }
      );
    } else {
      updatedSubcategory = await model.findByIdAndUpdate(
        id,
        { $pull: data },
        { new: true }
      );

    }

    res.status(200).json(updatedSubcategory);
  } catch (err) {
    res.status(500).json({ error: 'Error updating subcategory' });
  }
};

// Delete an item.
export const deleteById = (model) => async (req, res) => {
  const { id } = req.params;

  try {
    const data = await model.findByIdAndDelete(id);
    if (!data) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an item with it's subData.
export const deleteBySub = (model, subModel) => async (req, res) => {
  const { id } = req.params;
  const { deleteSubData = false } = req.body

  try {
    const data = await model.findById(id);
    if (!data) return res.status(404).json({ error: 'Item not found' })

    if (deleteSubData) {
      const foreignKey = `${model.modelName.toLowerCase()}_id`;
      await subModel.deleteMany({ [foreignKey]: id });
    }

    await model.findByIdAndDelete(id);
    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProductById = (model) => async (req, res) => {
  const { _id, subcategory_id } = req.body;

  try {
    const product = await model.findById(_id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    if (subcategory_id) {
      const subcategory = await Subcategory.findById(subcategory_id);
      if (!subcategory) {
        return res.status(400).json({ error: `Invalid Subcategory ID` });
      }

      // Check for mismatch
      if (subcategory_id !== product.subcategory_id?.toString()) {
        return res.status(400).json({
          error: `Mismatch: Subcategory ID in request (${subcategory_id}) does not match product's subcategory ID (${product.subcategory_id})`,
        });
      }

      await Subcategory.findByIdAndUpdate(product.subcategory_id, {
        $pull: { products: _id },
      });
    }

    await product.deleteOne();

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

