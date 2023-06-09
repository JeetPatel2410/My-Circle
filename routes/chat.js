var express = require('express');
var router = express.Router();
const user = require('../models/users/save');
const chat = require('../models/users/chat')

// Render Chat Page
router.get("/", async function (req, res) {
    const userDetails = await user.find({ _id: { $ne: req.user._id } }).lean();
    res.render("partials/user/chat", { userDetails: userDetails, logInUser: req.user });
})

// Chat Details
router.post("/details", async function (req, res) {
    const chatUser = await user.findOne({ _id: { $eq: req.query.specId } }).lean();
    const messages = await chat.aggregate([
        {
            $match: {
                $or: [
                    { $and: [{ sendBy: req.user._id }, { receiveBy: req.query.specId }] },
                    { $and: [{ sendBy: req.query.specId }, { receiveBy: req.user._id }] }
                ]
            }
        }
    ])
    res.render("partials/user/chatbox", { layout: "blank", chatUser: chatUser, messages: messages, logInUser: req.user._id });
})

// Create Chat Collecation
router.post("/message", async function (req, res) {
    console.log(req.body, "req.bodyyyyyyyyyyyyyyyyyyy");
    await chat.create({
        sendBy: req.user._id,
        receiveBy: req.body.receiveBy,
        message: req.body.message
    });

    // io.to(req.body.receiveBy).emit("chat", `${req.body.message}`)
    io.to(req.body.receiveBy).emit("chat", {
        sendBy: req.user._id,
        message: req.body.message
    })
    res.status(201).json({
        status: 201,
        message: "message created Succesfully"
    });
})
module.exports = router;
