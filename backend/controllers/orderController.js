// controllers/orderController.js

import Order from '../models/order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

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

      // Populate user and items.product
      const populatedOrder = await Order.findById(order._id)
        .populate('user')
        .populate('items.product')
        .exec();

      // Update the user's orders list
      await User.findByIdAndUpdate(userId, {
        $addToSet: { orders: order._id },
      });

      res.status(201).json(populatedOrder);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  /* Finds All orders */
  static async fetchAllOrders(req, res) {
    try {
      const orders = await Order.find()
        .populate('user')
        .populate('items.product')
        .exec();

      res.status(200).json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  /* Update an Item by Id */
  static async updateOrder(req, res) {
    console.log('req.body=', req.body)
    const { id } = req.params
    console.log('id=', id);
    const { user, items, totalAmount, shippingAddress, status } = req.body;

    try {
      const order = await Order.findById(id);
      if (!order) return res.status(404).json({ error: 'Order not found' });

      let userId = user._id;

      // Create a new account if no userId found
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
          phone: user.phone || '',
          password: hashedPassword,
        });

        await newUser.save();
        userId = newUser._id;
      }

      const updateFields = {};
      let previousUserId = order.user;

      // Handle user update
      if (userId && userId !== String(previousUserId)) {
        console.log("user update:");
        const newUser = await User.findById(userId);
        if (!newUser) {
          return res.status(400).json({ error: 'Invalid new user ID' });
        }

        // Update the users' orders lists
        await User.findByIdAndUpdate(previousUserId, { $pull: { orders: order._id } });
        await User.findByIdAndUpdate(userId, { $addToSet: { orders: order._id } });

        updateFields.user = userId;
      }

      // Handle items update
      if (items && JSON.stringify(items) !== JSON.stringify(order.items)) {
        console.log("items update:");
        for (const item of items) {
          const productExists = await Product.findById(item.product);
          if (!productExists) {
            return res.status(400).json({ error: `Invalid product ID: ${item.product}` });
          }
        }
        updateFields.items = items;
      }

      // Handle shipping address update
      if (
        shippingAddress &&
        JSON.stringify(shippingAddress) !== JSON.stringify(order.shippingAddress)
      ) {
        console.log('shippingAddress update:')
        updateFields.shippingAddress = { ...order.shippingAddress, ...shippingAddress };
      }

      // Handle totalAmount update
      if (totalAmount && totalAmount !== order.totalAmount) {
        console.log('totalAmount update:')
        updateFields.totalAmount = totalAmount;
      }

      // Handle status update
      if (status && status !== order.status) {
        console.log('status update:')
        updateFields.status = status;
      }

      // Check if there are any updates
      if (Object.keys(updateFields).length === 0) {
        return res.status(200).json({ message: 'No changes made to the order' });
      }

      // Apply updates
      await Order.findByIdAndUpdate(id, updateFields, { new: true });

      // Fetch the updated order and populate fields
      const updatedOrder = await Order.findById(id)
        .populate('user')
        .populate('items.product')
        .exec();

      res.status(200).json(updatedOrder);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
}
