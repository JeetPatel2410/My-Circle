const mongoose = require("mongoose");
const option = {
    collection: "chat",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
    }
}

const chatSchema = new mongoose.Schema({           //chat Schema
    sendBy: {
        type: String,
        required: true,
    },
    receiveBy: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, option);

module.exports = mongoose.model("chat", chatSchema);      //chat Model
