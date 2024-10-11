const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRoutes = require("./Routes/userRoutes");
const chatRoutes = require("./Routes/chatRoutes");
const messageRoutes = require("./Routes/messageRoutes");
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend origin
    credentials: true,
  }));
dotenv.config();
app.use(bodyParser.json());

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('DB connection established');
    } catch (error) {
        console.error('Database connection failed:', error); // Fix: Added a more descriptive error log
        process.exit(1); // Exit with failure
    }
};

connectDB();

app.get("/", (req, res) => {
    res.send("Hello Bhau");
});

app.use("/user", userRoutes);
app.use("/chat", chatRoutes);
app.use("/message", messageRoutes);

const PORT = process.env.PORT || 8282;
app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`); // Fix: Changed string concatenation to template literal
});
