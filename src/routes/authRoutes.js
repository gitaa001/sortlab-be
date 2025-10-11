import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { updateProgress } from "../controllers/authController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Auth route is working"); //testing purpose
});

router.post("/register", registerUser);
router.post("/login", loginUser);

// Middleware untuk cek token
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Token invalid" });
    req.user = user;
    next();
  });
}

// Endpoint GET /auth/me → untuk ambil data user yang sedang login
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

router.put("/progress", authenticateToken, updateProgress);

// Endpoint untuk update skor user
router.post("/update-score", authenticateToken, async (req, res) => {
  const { userId, points } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // misal kamu tambahkan field totalPoints di schema user
    user.totalPoints = (user.totalPoints || 0) + points;
    await user.save();

    res.status(200).json({
      message: "Score updated successfully",
      totalPoints: user.totalPoints,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
