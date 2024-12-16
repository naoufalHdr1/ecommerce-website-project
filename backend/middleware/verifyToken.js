// middleware/verifyToken.js

import jwt from 'jsonwebtoken';

/* Middleware for Token Validation */
const verifyToken = (req, res, next) => {
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

export default verifyToken;
