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

    // array check for valid topics
    const validTopics = ['bubbleSort', 'selectionSort', 'insertionSort', 'mergeSort'];
    
    if (!validTopics.includes(topic)) {
      return res.status(400).json({ 
        message: "Invalid topic name",
        debug: {
          topic: topic,
          validTopics: validTopics
        }
      });
    }

    if (!user.progressPractice) {
      console.log('🔧 Initializing progressPractice...');
      user.progressPractice = {
        bubbleSort: false,
        selectionSort: false,
        insertionSort: false,
        mergeSort: false,
      };
    }

    // skip hasOwnProperty check
    user.progressPractice[topic] = true;

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
    
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // array check for valid topics
    const validTopics = ['bubbleSort', 'selectionSort', 'insertionSort', 'mergeSort'];
    
    if (!validTopics.includes(topic)) {
      return res.status(400).json({ 
        message: "Invalid topic name",
        debug: {
          topic: topic,
          validTopics: validTopics
        }
      });
    }

    if (!user.progressCompete) {
      console.log('🔧 Initializing progressCompete...');
      user.progressCompete = {
        bubbleSort: { score: null, done: false },
        selectionSort: { score: null, done: false },
        insertionSort: { score: null, done: false },
        mergeSort: { score: null, done: false },
      };
    }

    user.totalPoints += points;

    //skip hasOwnProperty check
    user.progressCompete[topic].score = points;
    user.progressCompete[topic].done = true;

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

export const getLeaderboard = async (req, res) => {
  try {
    // Fetch all users, sort by totalPoints descending
    const users = await User.find({})
      .select('username email totalPoints progressCompete')
      .sort({ totalPoints: -1 }) // Sort by points descending
      .limit(20); // Limit to top 20

    // Calculate completed quizzes for each user
    const leaderboardData = users.map(user => {
      let completedQuizzes = 0;
      
      // Count completed quizzes from progressCompete
      if (user.progressCompete) {
        const topics = ['bubbleSort', 'selectionSort', 'insertionSort', 'mergeSort'];
        completedQuizzes = topics.filter(topic => 
          user.progressCompete[topic] && user.progressCompete[topic].done === true
        ).length;
      }

      return {
        _id: user._id,
        username: user.username,
        email: user.email,
        totalPoints: user.totalPoints || 0,
        completedQuizzes: completedQuizzes
      };
    });

    res.status(200).json(leaderboardData);
  } catch (err) {
    console.error("Failed to get leaderboard:", err);
    res.status(500).json({ message: "Server error" });
  }
};