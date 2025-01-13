// controllers/UsersController.js

import User from '../models/User.js';

/**
 * UsersController class to handle user-related API routes.
 */
class UsersController {

  /* Creates a new user. */
  static async createUser(req, res) {
    console.log("req.body=", req.body)
    const { email, password, ...userData } = req.body;

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'User already exists' });

      // Create and save a new user
      console.log('password=', password)
      const hashedPassword = await User().hashPassword(password);
      console.log('hashed password=', hashedPassword)
      console.log('userData=', userData);
      const newUser = new User({ ...userData, email, password: hashedPassword });
      await newUser.save();

      // Convert user to plain object and remove the password
      const userWithoutPassword = newUser.toObject();
      delete userWithoutPassword.password;

      res.status(201).json(userWithoutPassword);
    } catch (err) {
      console.log(err);
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
