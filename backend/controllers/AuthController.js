// controllers/AuthController.js

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

class AuthController {

  /* Handles user registration by creating a new user */
  static async register(req, res) {
    const { name, email, password } = req.body;

    // Validate input in the controller
    if (!name) return res.status(400).json({ error: 'Missing name' });
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    try {
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'User already exists' });

      // Hash the password and create a new user
      const hashedPassword = await User().hashPassword(password);
      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      // TODO: Send Email to user

      return res.status(201).json({ id: newUser._id, email: newUser.email });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  /* Signs in the user */
  static async login(req, res) {
    const { email, password } = req.body;

    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });

    try {
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'Invalid email or password' })

      // Compare provided password with hashed password in database
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' })

      // Generate a JWT
      const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '3h' });

      res.status(200).json({ token });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  /* Invalidates the user's session or removes the JWT (handled on the client-side) */
  static logout(req, res) {
    res.status(200).json({ message: 'Logged out successfully' });
  }

  /* Retrieves details of the currently authenticated user. */
  static async getCurrentUser(req, res) {
    try {
      const user = await User.findById(req.user.id).select('-password');
      if (!user) return res.status(404).json({ error: 'User not found' })

      return res.status(200).json(user);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  /* Generates a password reset token and sends it to the user’s email */
  static async forgotPassword(req, res) {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: 'Missing email' });

    try {
      const user = await User.findOne({ email })
      if (!user) return res.status(404).json({ error: 'User not found' });

      // Generate a reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = await bcrypt.hash(resetToken, 10);

      // Save the hashed token and expiration to the user's record
      user.resetPasswordToken = hashedToken;
      user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
      await user.save();

      // TODO: Send email to user

      return res(200).json({ message: 'Password reset email sent'});
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }
}

export default AuthController;
