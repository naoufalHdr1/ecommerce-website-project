// modesl/Products.js

import mongoose from 'mongoose';

// Defining the Product Schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    stock: { type: Number, required: true, min: 0 },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [
      {
        name: { type: String },
        value: { type: String },
      },
    ],
    subcategory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
  }
);

// Create an instance of the Product module and export it
const Product = new mongoose.model('Product', ProductSchema)
export default Product;
