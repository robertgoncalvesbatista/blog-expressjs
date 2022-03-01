const { Schema, model } = require("mongoose")

const UsuarioSchema = new Schema({
    nome: {
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
    senha: {
        type: String,
        required: true
    }
})

module.exports = model("Usuario", UsuarioSchema)