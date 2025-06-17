const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const User = require("./models/User");
const Chat = require("./models/Chat");
const axios = require("axios");
const { createServer } = require("http");
const { Server } = require("socket.io");
require("dotenv").config();
const { Strategy: GoogleStrategy } = require("passport-google-oauth2");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`Client joined chat: ${chatId}`);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_PASSWORD,
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.email });
        if (!user) {
          user = await User.create({
            email: profile.email,
            password: "google",
          });
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

app.post("/auth", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  if (!user) {
    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ email, password: hashedPassword });
  } else {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Wrong password" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res.json({ token });
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.redirect(`http://localhost:5173/chat?token=${token}`);
  }
);

app.get("/chats", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    let chats = await Chat.find({ userId });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chats" });
  }
});

app.get("/chats/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const chat = await Chat.findOne({ _id: req.params.id, userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch chat" });
  }
});

app.post("/chats/:id/message", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const chat = await Chat.findOne({ _id: req.params.id, userId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    if (!req.body.text?.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    chat.messages.push({
      text: req.body.text,
      sender: chat.firstName,
      timestamp: new Date(),
    });

    await chat.save();
    io.to(req.params.id).emit("messageAdded", chat);

    let quote = "No quote available";
    try {
      const quoteResponse = await axios.get("https://zenquotes.io/api/random");
      quote = quoteResponse.data[0]?.q || "No quote available";
    } catch (err) {
      console.error("Failed to fetch quote:", err.message);
    }

    setTimeout(async () => {
      chat.messages.push({
        text: quote,
        sender: "user",
        timestamp: new Date(),
      });
      await chat.save();
      io.to(req.params.id).emit("messageAdded", chat);
      console.log("Quote added to chat:", quote);
    }, 3000);

    res.json({ success: true, chat });
  } catch (err) {
    console.error("Error in /chats/:id/message:", err);
    res.status(500).json({ message: "Failed to send message" });
  }
});

app.post("/chats", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { firstName, lastName } = req.body;
    if (!firstName || !lastName)
      return res.status(400).json({ message: "Missing fields" });

    const newChat = await Chat.create({
      userId,
      firstName,
      lastName,
      messages: [],
    });

    res.status(201).json(newChat);
  } catch (err) {
    res.status(500).json({ message: "Failed to create chat" });
  }
});

app.put("/chats/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    const { firstName, lastName } = req.body;
    if (!firstName || !lastName) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const updatedChat = await Chat.findOneAndUpdate(
      { _id: req.params.id, userId },
      { firstName, lastName },
      { new: true }
    );

    if (!updatedChat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.json(updatedChat);
  } catch (err) {
    console.error("Error updating chat:", err);
    res.status(500).json({ message: "Failed to update chat" });
  }
});

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    httpServer.listen(5000, () => console.log("Server started on port 5000"));
  } catch (err) {
    console.error(err);
  }
};

start();
