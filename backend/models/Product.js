// modesl/Products.js

import mongoose from 'mongoose';

// Defining the Product Schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, default: 0 },
    stock: { type: Number, min: 0, default: 0 },
    images: { type: [String], default: ['/uploads/product-placeholder.png'] },
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
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Create an instance of the Product module and export it
const Product = new mongoose.model('Product', ProductSchema)
export default Product;
