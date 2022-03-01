const { Schema, model } = require("mongoose")

const CategoriaSchema = new Schema({
    nome: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = model("Categoria", CategoriaSchema)