const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'votre-secret-super-securise-a-changer';

// Middleware d'authentification
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Token d\'authentification requis'
    });
  }
  
  const token = authHeader.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Format de token invalide'
    });
  }
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token invalide ou expiré'
      });
    }
    
    req.user = decoded;
    next();
  });
}

// Générer un token
function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '24h'
  });
}

// Middleware optionnel (pour les routes publiques)
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    
    if (token) {
      jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (!err) {
          req.user = decoded;
        }
        next();
      });
    } else {
      next();
    }
  } else {
    next();
  }
}

module.exports = {
  authenticateToken,
  optionalAuth,
  generateToken
};
