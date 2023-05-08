const mongoose = require("mongoose");
const option = {
    collection: "otp",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
    }
}

const otpSchema = new mongoose.Schema({           //Otp Schema
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    }
},option);

otpSchema.index({ "createdOn": 1 }, { expireAfterSeconds: 60 })
module.exports = mongoose.model("otp", otpSchema);      //Otp Model

// ,
//     createdAt: {
//         type: Date,
//         default: Date.now,
//         expires: 60,
//     }