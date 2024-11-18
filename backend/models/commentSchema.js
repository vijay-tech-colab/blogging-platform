const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    blog: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog', // References the Blog model
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // References the User model
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  const Comment = mongoose.model('Comment', commentSchema);
  
  module.exports = Comment;
  