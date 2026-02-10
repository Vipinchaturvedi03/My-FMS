/**
 * JWT Authentication Middleware
 * Protected routes ke liye token verify
 * Vipin Chaturvedi - FMS
 */

const jwt = require('jsonwebtoken');

function verifyUserToken(request, response, next) {
  const authHeaderValue = request.headers.authorization || '';
  const bearerPrefix = 'Bearer ';
  const tokenValue = authHeaderValue.startsWith(bearerPrefix)
    ? authHeaderValue.slice(bearerPrefix.length)
    : null;

  if (!tokenValue) {
    return response.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decodedPayload = jwt.verify(tokenValue, process.env.JWT_SECRET);
    request.user = {
      id: decodedPayload.id,
      mobile: decodedPayload.mobile,
      name: decodedPayload.name
    };
    next();
  } catch {
    return response.status(401).json({ message: 'Session expired or invalid' });
  }
}

module.exports = verifyUserToken;
