import pkg from 'uuid';

const { v4: uuidv4 } = pkg;
export const generateSessionId = (req, res, next) => {
  if (!req.cookies.sessionId) {
    const sessionId = uuidv4();
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
	  req.cookies.sessionId = sessionId;
  }
  next();
}
