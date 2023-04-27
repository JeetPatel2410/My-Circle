const mongoose = require("mongoose");
const option = {
    collection: "postsavebies",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
    }
}

const savepostSchema = new mongoose.Schema({
    postBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
    },
    saveBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts"
    }
},option);

module.exports = mongoose.model("postsavebies", savepostSchema);      
