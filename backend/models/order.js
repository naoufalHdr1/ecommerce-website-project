import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        size: { type: String },
        color: { type: String },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        totalPrice: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingAddress: {
      firtName: { type: String, required: true },
      lastName: { type: String, required: true },
      adressLine1: { type: String, required: true },
      adressLine2: { type: String },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    status: {
      type: String,
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
