// controllers/cartControllers.js

import Cart from '../models/cart.js';
import User from '../models/User.js';


/**
 * CartController class to handle cart-related API routes.
 */
export default class CartController {

  static async addToCart(req, res) {
    try {
      const sessionId = req.cookies?.sessionId;
      const { userId, items, totalAmount } = req.body;
      let cart;

      if (userId) {
        const user = await User.findOne({ _id: userId });
        if (!user) return res.status(400).json({ error: 'User Id not valid' });
        cart = await Cart.findOne({ user: userId });
      } else {
        cart = await Cart.findOne({ sessionId });
      }

      if (!cart) {
        // Create a new cart
        cart = new Cart({
          user: userId || null,
          sessionId: userId ? null : sessionId,
          items,
          totlaAmount,
        });
      } else {
        // Update existing cart
        const existingItem = cart.items.find(item => item.product === items.product);

        if (existingItem &&
          (existingItem.size === items.size && existingItem.color === items.color)) {
          existingItem.quantity += items.quantity;
          existing.totalPrice += items.totalPrice;
        } else {
          cart.items.push(items);
        }

        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
      }

      await cart.save();

      res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
}
