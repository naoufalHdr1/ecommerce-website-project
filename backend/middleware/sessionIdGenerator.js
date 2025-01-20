import { v4: uuidv4 } from 'uuid';

export const generateSessionId = (req, res, next) => {
  if (!req.cookies.sessionId) {
    const sessionId = uuidv4();
    res.cookies('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }
  next();
}
