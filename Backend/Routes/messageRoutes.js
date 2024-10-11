const express = require('express');
const { allMessages, sendMessages } = require('../Controllers/messageController');
const { protect } = require('../middleware/authMiddleware'); // Fix: Destructure `protect` properly

const Router = express.Router();

Router.route('/:chatId').get(protect,allMessages);
Router.route('/').post(protect,sendMessages);
 
module.exports = Router;
