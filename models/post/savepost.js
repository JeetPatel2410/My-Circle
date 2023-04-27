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


// postSchema.pre("findOneAndUpdate", async function (next) {
//     // console.log(this);

//     let text = this._update.image;
//     let result = text.replace("public", ".");
//     this.set({ image: result })
//     next();
// });

module.exports = mongoose.model("postsavebies", savepostSchema);      
