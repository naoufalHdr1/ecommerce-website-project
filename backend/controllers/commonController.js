import { checkDocumentExists } from '../utils/helper.js';
import Subcategory from '../models/subcategory.js';
import Category from '../models/category.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { __dirname } from '../server.js';


// Add a new item.
export const createProduct = (model) => async (req, res) => {
  const { subcategory_id, ...productData } = req.body;

  try {
    const newProduct = await model.create({
      ...productData,
      subcategory_id: subcategory_id || null,
    });

    if (subcategory_id) {
      const subcategory = await Subcategory.findById(subcategory_id);
      if (!subcategory) {
        console.warn(`Invalid Subcategory ID: ${subcategory_id}`);
        console.warn('Product will be created without a valid subcategory.');
      } else {
        await Subcategory.findByIdAndUpdate(subcategory_id, {
          $addToSet: { products: newProduct._id },
        });
      }
    }

    res.status(201).json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const create = (model) => async (req, res) => {
  try {
    const data = await model.create(req.body);
    res.status(201).json(data);
  } catch (err) {
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
  const {subcategory_id, images, ...updateData } = req.body;
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

    // Handle image deletion from uploads folder
    if (images) {
      const existingImages = existingProduct.images || [];
      const imagesToDelete = existingImages.filter((image) => !images.includes(image));

      imagesToDelete.forEach((image) => {
        const imagePath = path.join(__dirname, image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        } else {
          console.warn(`Image file not found: ${imagePath}`)
        }
      });
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

    // Handle image deletion
    if (product.images && product.images.length > 0) {
      product.images.forEach((image) => {
        const imagePath = path.join(__dirname, image);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        } else {
          console.warn(`Image file not found: ${imagePath}`)
        }
      });
    }

    await product.deleteOne();

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteBulk = (model) => async (req, res) => {
  const productsToDelete = req.body;

  if (!Array.isArray(productsToDelete) || productsToDelete.length === 0) {
    return res.status(400).json({ error: 'No product provided' });
  }

  const productIds = productsToDelete.map((product) => product._id);

  try {
    // Check if each product exists
    const products = await model.find({ _id: { $in: productIds } });
    if (!products) {
      return res.status(404).json({ error: "No matching products found" });
    }

    // Update related subcategories
    const subcategoryUpdates = products.map(async (product) => {
      if (product.subcategory_id) {
        return Subcategory.findByIdAndUpdate(product.subcategory_id, {
          $pull: { products: product._id },
        });
      }
      return null;
    });

    // Delete product images
    products.forEach((product) => {
      if (product.images && product.images.length > 0) {
        product.images.forEach((image) => {
          const imagePath = path.join(__dirname, image);
          if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
          else console.warn(`Image file not found: ${imagePath}`)
        });
      }
    });

    await Promise.all(subcategoryUpdates);

    await model.deleteMany({ _id: { $in: productIds } });

    return res.status(200).json({ message: "Products deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
