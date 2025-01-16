import { checkDocumentExists, deleteFiles } from '../utils/helper.js';
import Subcategory from '../models/subcategory.js';
import Category from '../models/category.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { __dirname } from '../server.js';

// Add a new item. (Generalized create operation)
export const createItem = (childModel, parentModel = null) => async (req, res) => {
  // Determine if a parent relationship exists
  const isParentRequired = parentModel !== null;
  console.log('isParentRequired=', isParentRequired);
  const parentKey = isParentRequired
    ? childModel.modelName === 'Product'
      ? 'subcategory_id'
      : 'category_id'
    : null;
  console.log('parentKey=', parentKey);

  console.log('req body=', req.body);
  const { [parentKey]: parentId, ...itemData } = req.body;
  console.log('parent id=', parentId);

  try {
    // Create the new item
    const newItem = await childModel.create({
      ...itemData,
      ...(isParentRequired && { [parentKey]: parentId || null }),
    });
    console.log("new item=", newItem)

    // Handle subItem (subcategory or category) updates if needed
    if (isParentRequired && parentId) {
      const parentItem = await parentModel.findById(parentId);
      if (!parentItem) {
        console.warn(`Invalid ${parentKey}: ${parentId}`);
        console.warn('Item will be created without a valid parent item.');
      } else {
        const updateField = childModel.modelName === 'Product' ? 'products' : 'subcategories';
        await parentModel.findByIdAndUpdate(parentId, {
          $addToSet: { [updateField]: newItem._id },
        });
      }
    }

    res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
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
	console.log("query=", query)

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

// update an Item by Id (Generalized update operation)
export const updateItemById = (childModel, parentModel = null) => async (req, res) => {
  const { id } = req.params;
  const { images, banners, ...updateData } = req.body;
  const parentKey = parentModel
    ? childModel.modelName === 'Product'
      ? 'subcategory_id'
      : 'category_id'
    : null;

  const parentId = parentKey ? req.body[parentKey] : null;

  try {
    const existingItem = await childModel.findById(id);
    if (!existingItem) return res.status(404).json({ error: `${childModel.modelName} not found` });

    if (parentModel && parentKey) {
      let parentItem = null;

      if (parentId) {
        parentItem = await parentModel.findById(parentId);
        if (!parentItem) {
          return res.status(400).json({ error: `Invalid ${parentKey}: ${parentId}` });
        }
      }

      const parentField = parentModel.modelName === 'Subcategory' ? 'products' : 'subcategories';
      if (existingItem[parentKey] && existingItem[parentKey] !== parentId) {
        await parentModel.updateOne(
          { _id: existingItem[parentKey] },
          { $pull: { [parentField]: id } },
        );
      }

      if (parentId) {
        await parentModel.updateOne(
          { _id: parentId },
          { $addToSet: { [parentField]: id } },
        );
      }
    }

    // Handle image deletion
    if (images && existingItem.images) {
      const existingImages = existingItem.images || [];
      const imagesToDelete = existingImages.filter((image) => !images.includes(image));
      deleteFiles(imagesToDelete);
    }

    // Handle banner deletion
    if (banners && existingItem.banners) {
      const existingBanners = existingItem.banners || [];
      const bannersToDelete = existingBanners.filter((banner) => !banners.includes(banner));
      deleteFiles(bannersToDelete);
    }

    const updatedItem = await childModel.findByIdAndUpdate(
      id,
      { $set: {
        ...updateData,
        ...(images && { images }),
        ...(banners && { banners }),
      }},
      { new: true, runValidators: true },
    );

    res.json(updatedItem);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Error updating ${childModel.modelName}` });
  }
};

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

// Delete an item (Generalized)
export const deleteItemById = (childModel, parentModel = null) => async (req, res) => {
  console.log("delete req body=", req.body)
  console.log("delete req params=", req.params)
  // Determine if a parent relationship exists
  const isParentRequired = parentModel !== null;
  const parentKey = isParentRequired
    ? childModel.modelName === 'Product'
      ? 'subcategory_id'
      : 'category_id'
    : null;

  const { id } = req.params;
  const { [parentKey]: parent_id } = req.body;

  try {
    // Find the item to delete
    const item = await childModel.findById(id);
    console.log("Item found=", item)
    if (!item) {
      return res.status(404).json({ error: `${childModel.modelName} not found` });
    }

    // Handle parent relationship if parentModel is provided
    if (parentModel && parent_id) {
      const parent = await parentModel.findById(parent_id);
      if (!parent) {
        console.warn(`Parent document with ID ${parent_id} not found. Cleaning up child reference...`);
       // await childModel.findByIdAndUpdate(id, { $unset: { [parentKey]: '' } });
        //return res.status(200).json({ message: 'Parent not found. Reference removed from child.' });
      }

      // Check for parent-child mismatch
      if (parent_id !== item[parentKey]?.toString()) {
        return res.status(400).json({
          error: `Mismatch: Parent ID in request (${parent_id}) does not match item's ${parentKey} (${item[parentKey]})`,
        });
      }

      // Remove reference from parent
      const parentField = parentModel.modelName === 'Subcategory' ? 'products' : 'subcategories';
      await parentModel.findByIdAndUpdate(parent_id, {
        $pull: { [parentField]: id },
      });
    }

    // Handle file deletions (images or banners)
    const fileFields = ['images', 'banners'];
    fileFields.forEach((field) => {
      const files = item[field];
      if (files && files.length > 0) {
        deleteFiles(files);
      }
    });

    await item.deleteOne();

    return res.status(200).json({ message: `${childModel.modelName} deleted successfully` });
  } catch (err) {
    console.error(err);
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
