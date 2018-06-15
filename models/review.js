var mongoose = require('mongoose');

// Schema Setup
var reviewSchema = new mongoose.Schema({
  imdbID: String,
  omdbInfo: Object,
  reviewText: String,
  rating: String,
  date: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ]
});

module.exports = mongoose.model('Review', reviewSchema);
