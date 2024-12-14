// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dbClient from '../config/db.js';

// Defining the User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin']},
  },
  { timestamps: true }
);

/**
 * User Model class to handle user-related operations.
 */
class User {
  constructor() {
    this.userModel = mongoose.model('users', userSchema)
  }

  /**
   * Creates a new user in the database.
   * 
   * @param {string} name - The name of the user.
   * @param {string} email - The email of the user.
   * @param {string} password - The plain text password of the user.
   * @param {string} role - The role of the user
   * @returns {Promise<Object>} - Returns a promise that resolves to the newly created user object.
   * @throws {Error} - Throws an error if the user already exists.
   */
  async create(name, email, password, role) {
    // Check if the user already exists
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) throw new Error('User already exists');
      
    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const user = new this.userModel({ name, email, password: hashedPassword, role });
    await user.save();
    
    return user;
  }

  /**
   * Finds a user by their ID.
   *
   * @param {string} userId - The ID of the user to find.
   * @returns {Promise<Object>} - Returns a promise that resolves to the user object if found.
   * @throws {Error} - Throws an error if the user is not found.
   */
  async findUserById(userId) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new Error ('User not found');

    return user;
  }

  /**
   * Updates the user data based on the user ID.
   *
   * @param {string} userId - The ID of the user to update.
   * @param {Object} updatedData - The updated data for the user.
   * @returns {Promise<Object>} - Returns a promise that resolves to the updated user object.
   * @throws {Error} - Throws an error if the user is not found or update fails.
   */
  async update(userId, updatedData) {
    // Check for unknown fields
    const validFields = Object.keys(userSchema.paths);
    const invalidFields = Object.keys(updatedData).filter(key => !validFields.includes(key));
    if (invalidFields.length > 0)
      throw new Error(`Invalid fields: ${invalidFields.join(', ')}`);

    // Check if password is included in the updated data
    if (updatedData.password) {
      const salt = await bcrypt.genSalt(10);
      updatedData.password = await bcrypt.hash(updatedData.password, salt);
    }

    const user = await this.userModel.findByIdAndUpdate(userId, updatedData, { new: true });
    if (!user) throw new Error('User not found');

    return user;
  }

  /**
   * Deletes a user by their ID.
   *
   * @param {string} userId - The ID of the user to delete.
   * @returns {Promise<Object>} - Returns a promise that resolves to the deleted user object.
   * @throws {Error} - Throws an error if the user is not found or deletion fails.
   */
  async deleteUser(userId) {
    const user = await this.userModel.findByIdAndDelete(userId);
    if (!user) throw new Error('User not found');

    return user;
  }
}

// Create an instance of User model and export it
export default new User();
