// controllers/cartControllers.js

import Cart from '../models/cart.js';
import User from '../models/User.js';


/**
 * CartController class to handle cart-related API routes.
 */
export default class CartController {

  static async addToCart(req, res) {
    try {
      let cart;
      const filter = req.userId ? { userId: req.userId } : { sessionId: req.sessionId };
      const { items, totalAmount } = req.body;

      cart = await Cart.findOne(filter);

      if (!cart) {
        // Create a new cart
        cart = new Cart({
          user: filter.userId || null,
          sessionId: filter.userId ? null : filter.sessionId,
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
      const filter = req.userId ? { userId: req.userId } : { sessionId: req.sessionId };

      const cart = await Cart.findOne(filter)
        .populate('items.product')
        .exec();

      res.status(200).json(cart);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  static async updateCart(req, res) {
    try {
      const filter = req.userId ? { userId: req.userId } : { sessionId: req.sessionId };
      const { items, totalAmount } = req.body;
      let cart;

      cart = await Cart.findOne(filter);
      if (!cart) return res.status(404).json({ error: 'Cart not found' });

      cart.items = items;
      cart.totalAmount = totalAmount;

      await cart.save();

      const populatedCart = await Cart.findById(cart._id).populate('items.product');

      res.status(200).json(populatedCart);
     } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
}
