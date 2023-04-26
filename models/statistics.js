const mongoose = require("mongoose");
const option = {
    collection: "statistics",
    timestamps: {
        createdAt: "createdOn",
        updatedAt: "updatedOn",
    }
}

const postSchema = new mongoose.Schema({           //User Schema
    totalpost: {
        type: String,
        require: true
    },
    totalsavedpost: {
        type: String,
        require:true
    }
}, option);




module.exports = mongoose.model("statistics", postSchema);     