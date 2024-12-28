import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category_id: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    products : [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Subcategory = mongoose.model('Subcategory', subcategorySchema);
export default Subcategory
