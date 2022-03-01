const { Schema, model } = require("mongoose")

const PostSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: String,
        required: true
    }
})

module.exports = model("Post", PostSchema)