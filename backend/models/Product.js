// modesl/Products.js

import mongoose from 'mongoose';

// Defining the Product Schema
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
    image: { type: String },
    price: { type: String, required: true },
    sizes: { type: String, required: true },
    colors: { type: String },
    subcategory_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subcategory',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create an instance of the Product module and export it
const Product = new mongoose.model('Product', ProductSchema)
export default Product;
