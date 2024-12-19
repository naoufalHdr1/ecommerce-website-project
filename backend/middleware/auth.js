// middleware/verifyToken.js

import jwt from 'jsonwebtoken';

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
      res.statuas(403).json({ error: 'Access denied. Admins only.' })

    next();
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
};
