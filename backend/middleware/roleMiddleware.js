const { protect } = require('./authMiddleware');

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
};

const memberOrAdmin = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'member')) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied.' });
  }
};

module.exports = { adminOnly, memberOrAdmin };