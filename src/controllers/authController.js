import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();

    res.status(201).json({ message: "Registered successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { userId, topic } = req.body;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.progressPractice) {
      console.log('🔧 Initializing progressPractice...');
      user.progressPractice = {
        bubbleSort: false,
        selectionSort: false,
        insertionSort: false,
        mergeSort: false,
      };
    }

    if (user.progressPractice && user.progressPractice.hasOwnProperty(topic)) {
      user.progressPractice[topic] = true;
    } else {
      return res.status(400).json({ 
        message: "Invalid topic name",
        debug: {
          topic: topic,
          progressPractice: user.progressPractice,
          validTopics: ['bubbleSort', 'selectionSort', 'insertionSort', 'mergeSort']
        }
      });
    }

    await user.save();
    res.json({ progressPractice: user.progressPractice });
  } catch (err) {
    console.error("Failed to update progress:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateScore = async (req, res) => {
  try {
    const { userId, points, topic } = req.body;
    
    console.log('=== DEBUG updateScore ===');
    console.log('userId:', userId);
    console.log('points:', points);
    console.log('topic:', topic);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    console.log('user.progressCompete before init:', user.progressCompete);

    if (!user.progressCompete) {
      console.log('🔧 Initializing progressCompete...');
      user.progressCompete = {
        bubbleSort: { score: null, done: false },
        selectionSort: { score: null, done: false },
        insertionSort: { score: null, done: false },
        mergeSort: { score: null, done: false },
      };
    }

    console.log('user.progressCompete after init:', user.progressCompete);
    console.log('user.progressCompete keys:', Object.keys(user.progressCompete || {}));
    console.log('hasOwnProperty check:', user.progressCompete?.hasOwnProperty(topic));

    user.totalPoints += points;

    if (user.progressCompete && user.progressCompete.hasOwnProperty(topic)) {
      user.progressCompete[topic].score = points;
      user.progressCompete[topic].done = true;
      
      console.log('✅ Updated progressCompete for topic:', topic);
    } else {
      console.log('❌ Invalid topic or progressCompete not initialized');
      return res.status(400).json({ 
        message: "Invalid topic name",
        debug: {
          topic: topic,
          progressCompete: user.progressCompete,
          validTopics: ['bubbleSort', 'selectionSort', 'insertionSort', 'mergeSort']
        }
      });
    }

    await user.save();

    res.status(200).json({
      message: "Score updated successfully",
      totalPoints: user.totalPoints,
      progressCompete: user.progressCompete,
    });
  } catch (err) {
    console.error("Failed to update score:", err);
    res.status(500).json({ message: "Server error" });
  }
};