import pkg from 'uuid';

const { v4: uuidv4 } = pkg;
export const generateSessionId = (req, res, next) => {
  if (!req.cookies.sessionId) {
    console.log("abcs")
    const sessionId = uuidv4();
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    req.cookies.sessionId = sessionId;
  }
  next();
}
