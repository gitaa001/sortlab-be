import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    totalPoints: { type: Number, default: 0 },

    // PROGRESS BAGIAN PRACTICE
    progressPractice: {
      bubbleSort: { type: Boolean, default: false },
      selectionSort: { type: Boolean, default: false },
      insertionSort: { type: Boolean, default: false },
      mergeSort: { type: Boolean, default: false },
    },

    // PROGRESS BAGIAN COMPETE 
    progressCompete: {
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
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
