import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    sessionId: {
      type: String,
      required: false,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        size: { type: String, required: false },
        color: { type: String, required: false },
        quantity: {
          type: Number,
          required: true,
          min: 1,
          default: 1,
        },
        totalPrice: { type: Number, required: true },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
