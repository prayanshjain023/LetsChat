const express = require('express');
// userRoutes.js
const { loginController, signupController, fetchAllUsersController } = require('../Controllers/userController'); // Check this line
const { protect } = require('../Middleware/authMiddleware'); // Fix: Destructure `protect` properly

const Router = express.Router();

Router.post('/login', loginController);
Router.post('/signup', signupController);
Router.get("/fetchusers",protect, fetchAllUsersController);

module.exports = Router;
