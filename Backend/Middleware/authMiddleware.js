const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const expressAsyncHandler = require('express-async-handler');

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;

  // Check if authorization header is present and starts with 'Bearer'
  if (req.headers.authorization) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token and decode
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user from the token, exclude password field
      req.user = await User.findById(decoded.id).select('-password');
      
      // Proceed to the next middleware
      return next();
    } catch (error) {
      console.error('JWT Error:', error.message); // Log the error for debugging
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  // Handle missing token
  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
});

module.exports = { protect };
