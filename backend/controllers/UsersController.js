// controllers/UsersController.js

import User from '../models/User.js';

/**
 * UsersController class to handle user-related API routes.
 */
class UsersController {

  /* Creates a new user. */
  static async createUser(req, res) {
    const { name, email, password, role} = req.body;

    // Validate input in the controller
    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'User already exists' });

      // Create and save a new user
      const hashedPassword = await User().hashPassword(password);
      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();

      res.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /* Finds a user by their ID. */
  static async findUser(req, res) {
    const { id } = req.params;

    try {
      const user = await User.findById(id).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /* Updates a user's data. */
  static async updateUser(req, res) {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
      // Prepare update object
      const updates = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (password) updates.password = await User().hashPassword(password);

      const updatedUser = await User.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true, 
      }).select('-password');

      if (!updatedUser) return res.status(404).json({ error: 'User not found' });

      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /* Deletes a user by their ID. */
  static async deleteUser(req, res) {
    const { id } = req.params;

    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) return res.status(404).json({ error: 'User not found' });

      res.status(200).json({ id: deletedUser._id });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default UsersController;
