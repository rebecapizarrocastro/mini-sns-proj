const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const feedSchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4,
      unique: true, // Unique identifier for each feed
    },
    content: {
      type: String,
      required: true, // Feed content (required)
    },
    author: {
      type: String,
      required: true, // Author name (required)
    },
    likes: [String], // Array of usernames who liked the post
    comments: [
      {
        username: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "feed" }
); // Explicitly specify the collection name

module.exports = mongoose.model("Feed", feedSchema);
