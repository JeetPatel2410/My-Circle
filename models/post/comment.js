const mongoose = require("mongoose");
const option = {
    collection: "comment",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
    }
}

const commentSchema = new mongoose.Schema({           //Comment Schema
    commentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    },
    comment: {
        type: String,
        require: true
    }
}, option);

module.exports = mongoose.model("comment", commentSchema);      //Comment Model
