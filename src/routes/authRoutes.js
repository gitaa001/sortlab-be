import express from "express";
import { registerUser, loginUser, updateProgress, updateScore } from "../controllers/authController.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Auth route is working");
});

router.post("/register", registerUser);
router.post("/login", loginUser);

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

router.post("/update-progress", authenticateToken, updateProgress);
router.post("/update-score", authenticateToken, updateScore);

router.get("/me", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

export default router;