// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const SECRET_KEY =
  process.env.SECRET_KEY ||
  process.env.JWT_SECRET ||
  'dev-insecure-secret-change-me';

const auth = (roles = []) => (req, res, next) => {
  try {
    // Accept "Bearer <token>" OR just "<token>"
    const h = req.headers.authorization || req.header('Authorization') || '';
    const raw = h.replace(/^Bearer\s+/i, '').trim();

    // Some apps store the token with quotes in localStorage; strip them.
    const token = raw.replace(/^"|"$/g, '');

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (err) {
      const msg = err.name === 'TokenExpiredError'
        ? 'Session expired. Please log in again.'
        : 'Invalid or expired token';
      return res.status(401).json({ message: msg });
    }

    req.user = decoded;

    if (Array.isArray(roles) && roles.length > 0 && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Access denied. You do not have permission.' });
    }

    next();
  } catch {
    return res.status(500).json({ message: 'Auth error' });
  }
};

module.exports = auth;
