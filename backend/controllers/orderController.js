// controllers/orderController.js

import Order from '../models/order.js';
import User from '../models/User.js';

/**
 * OrderController class to handle order-related API routes.
 */
export default class OrderContorller {

  /* Creates a new order. */
  static async createOrder(req, res) {
    const { user, items, totalAmount, shippingAddress, status } = req.body;

    try {
      let userId = user._id;

      // Check if user is creating a new account
      if (!userId) {
        // Check if the email already exists
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          return res.status(400).json({ error: "User email already exists" });
        }

        // Create a new user with a default password
        const hashedPassword = await User().hashPassword('123456');
        const newUser = new User({
          fullName: user.fullName,
          email: user.email,
          phone: user.phone || '', // Optional field
          password: hashedPassword,
        });

        await newUser.save();
        userId = newUser._id; // Update the userId for the order
      }

      // Create the order
      const order = new Order({
        user: userId,
        items,
        totalAmount,
        shippingAddress,
        status,
      });

      await order.save();

      // Update the user's orders list
      await User.findByIdAndUpdate(userId, {
        $addToSet: { orders: order._id },
      });

      res.status(201).json(order);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }


}
