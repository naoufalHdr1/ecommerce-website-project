// models/User.js

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Defining the User Schema
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
  },
  { timestamps: true }
);

// Add a method to the User model for hashing the password
userSchema.methods.hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Create an instance of User model and export it
const User = mongoose.model('User', userSchema);
export default User;
