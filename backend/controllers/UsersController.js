// controllers/UsersController.js

import User from '../models/User.js';

/**
 * UsersController class to handle user-related API routes.
 */
class UsersController {

  /* Creates a new user. */
  static async createUser(req, res) {
    const { email, password, ...userData } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'User already exists' });

      // Create and save a new user
      const hashedPassword = await User().hashPassword(password);
      const newUser = new User({ ...userData, email, password: hashedPassword });
      await newUser.save();

      // Convert user to plain object and remove the password
      const userWithoutPassword = newUser.toObject();
      delete userWithoutPassword.password;

      res.status(201).json(userWithoutPassword);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /* Finds all users */
  static async findAllUser(req, res) {
    try {
      const users = await User.find();
      
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
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

  /* Finds a user by token stored in cookies */
  static async findByToken(req, res) {
    const userId = req.userId;

    if (!userId) return res.status(400).json({ error: 'UserId not valid' });

    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  /* Update a user by token stored in cookies */
  static async updateByToken(req, res) {
    const userId = req.userId;
    if (!userId) return res.status(400).json({ error: 'UserId not valid' });

    try {
      const updatedUser = await User.findByIdAndUpdate(userId, req.body, {
        new: true,
        runValidators: true,
      }).select('-password');
      if (!updatedUser) return res.status(404).json({ error: 'User not found' });

      res.status(200).json(updatedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  /* finds a user by their name. */
  static async findUserByName(req, res) {
    const query = req.query;

    try {
      const user = await User.find(query);
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
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
