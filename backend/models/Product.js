// modesl/Products.js

import mongoose from 'mongoose';

// Defining the Product Schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    image: { type: String },
  },
  {
    timestamps: true,
  }
);

// Create an instance of the Product module and export it
const Product = new mongoose.model('Product', ProductSchema)
export default Product;
