// controllers/UsersController.js

import User from '../models/User.js';
import mongoose from 'mongoose';

/**
 * Validates if a given ID is a valid ObjectId.
 *
 * @param {string} id - The ID to validate.
 * @returns {boolean} - Returns true if valid, false otherwise.
 */
const isValidObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

/**
 * UsersController class to handle user-related API routes.
 */
class UsersController {

  /**
   * Creates a new user.
   *
   * @param {Object} req - The request object containing the user data.
   * @param {Object} res - The response object used to send the result or error.
   * @returns {Promise<void>} - Sends a response with the status of the operation.
   * @throws {Error} - Throws an error if required fields are missing or user creation fails.
   */
  static async createUser(req, res) {
    const { name, email, password, role = 'customer' } = req.body;

    // Validate input in the controller
    if (!name || !email || !password)
      return res.status(400).json({ error: 'Name, email, and password are required' });
    
    try {
      const newUser = await User.create(name, email, password, role);
      res.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * Finds a user by their ID.
   *
   * @returns {Promise<void>} - Sends a response with the status of the operation.
   * @throws {Error} - Throws an error if the user is not found.
   */
  static async findUser(req, res) {
    const { id } = req.params;

    // Validate if the ID is a valid ObjectId
    if (!isValidObjectId(id))
      return res.status(400).json({ error: 'Invalid user ID format' });

    try {
      const user = await User.findUserById(id);
      res.status(200).json(user);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * Updates a user's data.
   *
   * @returns {Promise<void>} - Sends a response with the status of the operation.
   * @throws {Error} - Throws an error if the user is not found or update fails.
   */
  static async updateUser(req, res) {
    const { id } = req.params;
    const updatedData = req.body;

    // Validate if the ID is a valid ObjectId
    if (!isValidObjectId(id))
      return res.status(400).json({ error: 'Invalid user ID format' });

    // Check if there's any data in the request body
    if (Object.keys(updatedData).length === 0) {
      return res.status(400).json({ error: 'No data provided for update' });
    }

    try {
      const updatedUser = await User.update(id, updatedData);
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /**
   * Deletes a user by their ID.
   *
   * @returns {Promise<void>} - Sends a response with the status of the operation.
   * @throws {Error} - Throws an error if the user is not found or deletion fails.
   */
  static async deleteUser(req, res) {
    const { id } = req.params;

    // Validate if the ID is a valid ObjectId
    if (!isValidObjectId(id))
      return res.status(400).json({ error: 'Invalid user ID format' });

    try {
      const deletedUser = await User.deleteUser(id);
      res.status(200).json(deletedUser);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

export default UsersController;
