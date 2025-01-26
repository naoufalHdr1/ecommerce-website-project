// middleware/verifyToken.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import pkg from 'uuid';

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
	const { v4: uuidv4 } = pkg;
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

/* Middleware to handle authentication and session management */
export const handleAuthAndSession = (req, res, next) => {
  const { v4: uuidv4 } = pkg;
  const token = req.cookies.token;
  const sessionId = req.cookies.sessionId;

  // If token exists, decode it to get user ID
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userId = decoded.id;
    } catch (err) {
      console.error('Invalid token:', err);
      return res.status(401).json({ error: 'Invalid or expired token' });
    }
  } else if (sessionId) {
    // If no token but sessionId exists (for guests)
    req.sessionId = sessionId;
  } else {
    // If neither token nor sessionId exists, generate a new sessionId
    const newSessionId = uuidv4();
    res.cookie('sessionId', newSessionId, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    req.sessionId = newSessionId;
  }

  next();
}
