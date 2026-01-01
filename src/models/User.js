import mongoose from "mongoose";

// SKEMA PRACTICE
const progressPracticeSchema = new mongoose.Schema({
  bubbleSort: { type: Boolean, default: false },
  selectionSort: { type: Boolean, default: false },
  insertionSort: { type: Boolean, default: false },
  mergeSort: { type: Boolean, default: false },
});

// SKEMA COMPETE 
const progressCompeteSchema = new mongoose.Schema({
  bubbleSort: {
    score: { type: Number, default: null },
    done: { type: Boolean, default: false },
  },
  selectionSort: {
    score: { type: Number, default: null },
    done: { type: Boolean, default: false },
  },
  insertionSort: {
    score: { type: Number, default: null },
    done: { type: Boolean, default: false },
  },
  mergeSort: {
    score: { type: Number, default: null },
    done: { type: Boolean, default: false },
  },
});

// SKEMA USER
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalPoints: { type: Number, default: 0 },
    latestCourse: { type: String, default: null }, // Track last opened course

    progressPractice: { type: progressPracticeSchema, default: () => ({}) },
    progressCompete: { type: progressCompeteSchema, default: () => ({}) },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
