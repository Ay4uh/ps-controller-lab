const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-in-prod';

module.exports = (db) => {
  // 1. Verify token and ensure session is active in db
  const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.auth_token;
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      
      // Query database to ensure session is active and user is not banned
      db.get(
        'SELECT s.is_active, u.is_banned, u.is_active as user_active FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ?',
        [token],
        (err, row) => {
          if (err) {
            return res.status(500).json({ error: 'Database error during token verification' });
          }
          if (!row) {
            return res.status(401).json({ error: 'Session not found' });
          }
          if (row.is_active === 0) {
            return res.status(401).json({ error: 'Session has been invalidated' });
          }
          if (row.is_banned === 1) {
            return res.status(403).json({ error: 'User is banned' });
          }
          if (row.user_active === 0) {
            return res.status(403).json({ error: 'User account is inactive' });
          }
          
          req.user = decoded;
          req.token = token;
          next();
        }
      );
    } catch (error) {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };

  // 2. Optional auth - does not block if token is missing/invalid
  const optionalAuth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.auth_token;
    
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(token, jwtSecret);
      
      db.get(
        'SELECT s.is_active, u.is_banned, u.is_active as user_active FROM sessions s JOIN users u ON s.user_id = u.id WHERE s.token = ?',
        [token],
        (err, row) => {
          if (!err && row && row.is_active === 1 && row.is_banned === 0 && row.user_active === 1) {
            req.user = decoded;
            req.token = token;
          }
          next();
        }
      );
    } catch (error) {
      next(); // Ignore error and continue
    }
  };

  // 3. Require a specific role
  const requireRole = (role) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      if (req.user.role !== role && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      next();
    };
  };

  // 4. Require admin role
  const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  };

  // 5. Require a specific permission
  const requirePermission = (permission) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      const permissions = req.user.permissions || [];
      const hasPermission = permissions.includes(permission) || permissions.includes('*');
      
      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      next();
    };
  };

  return {
    verifyToken,
    optionalAuth,
    requireRole,
    requireAdmin,
    requirePermission
  };
};
