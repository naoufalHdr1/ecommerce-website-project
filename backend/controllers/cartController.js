// controllers/cartControllers.js

import Cart from '../models/cart.js';
import User from '../models/User.js';


/**
 * CartController class to handle cart-related API routes.
 */
export default class CartController {

  static async addToCart(req, res) {
    try {
      const sessionId = req.sessionId;
      const { user, items, totalAmount } = req.body;
      let cart;

      if (user) {
        const existingUser = await User.findOne({ _id: user });
        if (!existingUser) return res.status(400).json({ error: 'User Id not valid' });
        cart = await Cart.findOne({ user: user });
      } else {
        cart = await Cart.findOne({ sessionId });
      }

      if (!cart) {
        // Create a new cart
        cart = new Cart({
          user: user || null,
          sessionId: user ? null : sessionId,
          items: [ items ],
          totalAmount,
        });
      } else {
        // Update existing cart
        const existingItem = cart.items.find(item =>
          item.product.toString() === items.product &&
          item.size === items.size &&
          item.color === items.color
        );

        if (existingItem) {
          existingItem.quantity += items.quantity;
          existingItem.totalPrice += items.totalPrice;
        } else {
          cart.items.push(items);
        }

        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalPrice, 0);
      }

      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate('items.product');
      res.status(200).json(populatedCart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  static async getCartItems(req, res) {
    try {
      console.log(req.cookies)
      const sessionId = req.cookies.sessionId;
      const { userId } = req.query;
      let cart;
      console.log("sessionId=", sessionId);
      console.log('********************************');
      console.log("userId=", userId)
      console.log('********************************');
      
      if (userId) {
        const existingUser = await User.findOne({ _id: userId });
        if (!existingUser) return res.status(400).json({ error: 'User Id not valid' });
        cart = await Cart.findOne({ user: userId })
          .populate('items.product')
          .exec();
      } else {
        cart = await Cart.findOne({ sessionId })
          .populate('items.product')
          .exec();
      }

      res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
}
