const mongoose = require("mongoose");
const option = {
    collection: "posts",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
    }
}

const postSchema = new mongoose.Schema({           //User Schema
    postBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
    },
    isArchiev: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
    }
}, option);


// postSchema.pre("findOneAndUpdate", async function (next) {
//     // console.log(this);

//     let text = this._update.image;
//     let result = text.replace("public", ".");
//     this.set({ image: result })
//     next();
// });

module.exports = mongoose.model("posts", postSchema);      //User Model
