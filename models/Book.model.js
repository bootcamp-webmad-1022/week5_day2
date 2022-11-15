const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    author: String,
    rating: Number,
    owner: {
      type: mongoose.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Book', bookSchema);