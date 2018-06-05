var mongoose = require('mongoose');

// Schema Setup
var reviewSchema = new mongoose.Schema({
    imdbID: String,
    title: String,
    posterURL: String,
    reviewText: String,
    rating: String,
    author: {
        id: {
            type: mongoose.Schema. Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Review", reviewSchema);

