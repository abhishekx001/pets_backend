const { verifyToken } = require('../utils/helpers');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('🔍 Auth Middleware - Authorization header:', authHeader);
  console.log('🔍 Auth Middleware - Extracted token:', token ? token.substring(0, 20) + '...' : 'No token');

  if (!token) {
    console.log('❌ Auth Middleware - No token provided');
    return res.status(401).json({ 
      success: false,
      message: 'Access token required' 
    });
  }

  try {
    const decoded = verifyToken(token);
    console.log('✅ Auth Middleware - Token verified successfully:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Auth Middleware - Token verification failed:', error.message);
    return res.status(403).json({ 
      success: false,
      message: 'Invalid or expired token' 
    });
  }
};

module.exports = { authenticateToken };
