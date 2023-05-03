const mongoose = require("mongoose");
const option = {
    collection: "users",
    timestamps: {
        createdAt: "createdOn",
    }
}

const userSchema = new mongoose.Schema({           //User Schema
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    }, isVerify: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        unique: true
    },
    image: {
        type: String
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    },
    password: {
        type: String,
        required: true
    },
    confirmpassword: {
        type: String,
        required: true
    }
}, option);


userSchema.pre("updateOne", async function (next) {
    // console.log(this);

    let text = this._update.image;
    let result = text.replace("public", ".");
    this.set({ image: result })
    next();
});

module.exports = mongoose.model("users", userSchema);      //User Model
