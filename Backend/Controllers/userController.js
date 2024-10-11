const User = require("../models/userModel");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../Config/genrateToken");

// Login controller
const loginController = expressAsyncHandler(async (req, res) => {
  const { name, password } = req.body; // Changed 'name' to 'name'

  // Check if all necessary fields are provided
  if (!name || !password) {
    return res.status(400).json({ message: "All necessary input fields must be provided" });
  }

  // Find user by name
  const user = await User.findOne({ name }); // Make sure the field is correct in the model
  console.log(user);
  
  
  // Check if user exists and password matches
  if (user && await user.matchPassword(password)) {
    const response = {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),

    };
    return res.json(response);
  }

  // If credentials are invalid, send a 401 response
  return res.status(401).json({ message: "Invalid credentials" });
});

// Signup controller
const signupController = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if all necessary fields are provided
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All necessary input fields must be provided" });
  }

  // Check if the user already exists
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(409).json({ message: "User already exists" });
  }

  const nameExist = await User.findOne({ name });
  if (nameExist) {
    return res.status(409).json({ message: "name already exists" });
  }

  // Create a new user
  const newUser = await User.create({ name, email, password });
  if (newUser) {
    return res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      isAdmin: newUser.isAdmin,
      token: generateToken(newUser._id),
    });
  } else {
    return res.status(400).json({ message: "Registration failed" });
  }
});

const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
  try {
    // Prepare search query based on the provided keyword
    
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: 'i' } }, // Case-insensitive search for name
            { email: { $regex: req.query.search, $options: 'i' } }, // Case-insensitive search for email
          ],
        }
      : {};

    // Fetch users excluding the logged-in user
    const users = await User.find(keyword).find({_id: { $ne: req.user._id } });

    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    // Send the list of users
    res.send(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Exporting controllers
module.exports = {
  loginController,
  signupController,
  fetchAllUsersController,
};
