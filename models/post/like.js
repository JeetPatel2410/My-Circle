const mongoose = require("mongoose");
const option = {
    collection: "like",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
    }
}

const likeSchema = new mongoose.Schema({           //Like Schema
    likeBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    }
}, option);

module.exports = mongoose.model("like", likeSchema);      //User Model
