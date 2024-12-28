// middleware/verifyToken.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/* Middleware for Token Validation */
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized: Invalid or expired token' })
  }
};

/* Middleware to check a user's role.*/
export const checkAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'admin')
      res.status(403).json({ error: 'Access denied. Admins only.' })

    next();
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
};

/* Middleware to validate the user role */
export const userRole = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
