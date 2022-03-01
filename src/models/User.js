const { Schema, model } = require("mongoose")

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    eAdmin: {//verificar se o usuário é admin
        type: Number,
        default: 0
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = model("User", UserSchema)