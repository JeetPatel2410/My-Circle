const mongoose = require("mongoose");
const option = {
    collection: "likenotification",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
    }
}

const likeNotificationSchema = new mongoose.Schema({           //likeNotificationSchema Schema
    likeBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    postBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    },
    likeByName: {
        type: String,
        required: true
    },
    isseen: {
        type: Boolean,
        default: false
    }
}, option);

module.exports = mongoose.model("likenotification", likeNotificationSchema);      //likeNotificationSchema Model
