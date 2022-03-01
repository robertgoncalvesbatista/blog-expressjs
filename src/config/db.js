require("dotenv").config()

const { connect, connection } = require("mongoose")

// Mongoose
connect(process.env.DATABASE, {
    useUnifiedTopology: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useCreateIndex: true
})

connection.on("error", () => console.error("Erro de conexão ao MongoDB: "))
connection.once("open", () => console.log("Banco de dados MongoDB conectado!"))