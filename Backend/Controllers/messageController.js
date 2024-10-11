const Message = require("../Models/messageModel");
const User = require("../Models/userModel");
const Chat = require("../Models/chatModel");
const expressAsyncHandler = require("express-async-handler");

// Fetch all messages for a particular chat
const allMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatid })
      .populate("sender", "name email") // Populate sender information
      .populate("chat")// Populate chat information
      .populate("reciver");

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error); // Log the error for debugging
    res.status(400).json({ message: error.message });
  }
});

// Send a new message
const sendMessages = expressAsyncHandler(async (req, res) => {
  const { content, chatid } = req.body;

  // Ensure content and chat ID are provided
  if (!content || !chatid) {
    return res.status(400).json({ message: "Please provide content and chat ID" });
  }

  // Create a new message object
  const newMessage = {
    sender: req.user._id,
    content: content,
    chat: chatid,
  };

  try {
    // Save the new message
    let message = await Message.create(newMessage);

    // Populate message data for the response
    message = await message
      .populate("sender", "name email") // Populate sender information
      .populate("chat"); // Populate chat information

    // Update the latest message in the chat
    await Chat.findByIdAndUpdate(chatid, { latestMessage: message }, { new: true }); // Ensure the latest message is updated correctly

    res.status(200).json(message); // Send the message back in the response
  } catch (error) {
    console.error('Error sending message:', error); // Log the error for debugging
    res.status(400).json({ message: error.message });
  }
});

module.exports = { allMessages, sendMessages };
