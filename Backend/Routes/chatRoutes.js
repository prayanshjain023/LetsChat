const express = require('express');
const { accessChat, fetchChat, fetchGroup, createGroupChat, groupExit, addSelfToGroup } = require('../Controllers/chatController');
const { protect } = require('../Middleware/authMiddleware'); // Fix: Destructure `protect` properly

const Router = express.Router();

Router.route('/').post(protect,accessChat);
Router.route('/').get(protect,fetchChat);
Router.route('/createchat').post(protect,createGroupChat);
Router.route('/fetchgroup').get(protect,fetchGroup);
Router.route('/groupexit').put(protect,groupExit);
Router.route('/addSelftogroup').put(protect,addSelfToGroup);
 
module.exports = Router;
