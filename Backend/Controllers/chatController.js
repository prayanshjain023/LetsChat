const expressAsyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

// Access an existing chat or create a new one between two users
const accessChat = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log('UserId parameter not sent with request');
    return res.status(400).json({ message: 'UserId parameter is required' });
  }

  if (!req.user || !req.user._id) {
    console.log('User not authenticated');
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    // Find an existing one-on-one chat between the two users
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } }
      ]
    })
      .populate('users', '-password')
      .populate('latestMessage');

    isChat = await User.populate(isChat, {
      path: 'latestMessage.sender',
      select: 'name email',
    });

    if (isChat.length > 0) {

      // return res.status(200).send(isChat[0]);
      return res.status(200).send(isChat);
    }
      const chatData = {
        chatName: 'Chat', // Consider dynamically setting the name based on the users
        isGroupChat: false,
        users: [req.user._id, userId],
      };

    // Create a new chat if none exists
    const createdChat = await Chat.create();
    const fullChat = await Chat.findOne({ _id: createdChat._id })
      .populate('users', '-password')
      .populate('latestMessage');
    res.status(200).send(fullChat);

  } catch (error) {
    console.error('Error in accessing or creating chat:', error);
    res.status(400).json({ message: error.message });
  }
});

// Fetch all chats of the current user
const fetchChat = expressAsyncHandler(async (req, res) => {
  try {
    // Fetch chats where the user is a participant, sorted by the latest update
    let chats = await Chat.find({ 
      users: { $elemMatch: { $eq: req.user._id } } 
    }) // Simplified query
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

    // Populate latest message's sender details
    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name email",
    });

    // Send the populated chat results
    res.status(200).json(chats);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


// Fetch all group chats the current user is a part of
const fetchGroup = expressAsyncHandler(async (req, res) => {
  try {
    const groupChats = await Chat.find({
      isGroupChat: true,
    })
      // .populate("users", "-password")
      // .populate("groupAdmin", "-password")
      // .populate("latestMessage")
      // .sort({ updatedAt: -1 });
      
    // Check if groupChats array is empty
    if (groupChats.length === 0) {
      return res.status(200).json({ message: "Threre is no any group" });
    }

    // If group chats exist, send them in the response
    res.status(200).json(groupChats);

  } catch (error) {
    console.error('Error fetching group chats:', error);
    res.status(400).json({ message: error.message });
  }
});


// Create a new group chat
const createGroupChat = expressAsyncHandler(async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return res.status(400).json({ message: "Please fill all the fields" });
  }

  const userList = users; // Assuming users is a JSON string

  if (userList.length < 2) {
    return res.status(400).json({ message: "At least 2 users are required to form a group chat" });
  }

  userList.push(req.user._id); // Add the current user to the list

  try {
    const groupChat = await Chat.create({
      chatName: name,
      users: userList,
      isGroupChat: true,
      groupAdmin: req.user._id,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    console.error('Error creating group chat:', error);
    res.status(400).json({ message: error.message });
  }
});

// Exit a group chat
const groupExit = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

// Add self to a group
const addSelfToGroup = expressAsyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).json({ message: "ChatId is required" });
  }

  try {
    const added = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: req.user._id } }, // Use $addToSet to prevent duplicates
      { new: true }
    )
      .populate('users', '-password')
      .populate('groupAdmin', '-password');

    if (!added) {
      return res.status(404).json({ message: 'Chat not found' });
    } else {
      res.status(200).json(added);
    }
  } catch (error) {
    console.error('Error adding user to group:', error);
    res.status(400).json({ message: error.message });
  }
});

module.exports = {
  accessChat,
  fetchChat,
  fetchGroup,
  createGroupChat,
  groupExit,
  addSelfToGroup,
};
