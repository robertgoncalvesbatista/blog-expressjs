//Carregando módulos
const express = require("express")
const exhbs = require("express-handlebars")

const app = express()
const path = require("path")
const mongoose = require("mongoose")
const session = require("express-session")
const flash = require("connect-flash")


const passport = require("passport")
require("./config/auth")(passport)

const { eAdmin } = require("./helpers/eAdmin") //{eAdmin}-> significa pegar apenas esta função    

const db = require("./config/db")

//Configurações
//Sessão
//Tudo que tiver app.use é um middleware
app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))
//Configuração do Passport
app.use(passport.initialize())
app.use(passport.session())

//flash
app.use(flash())

//Middleware
app.use((req, res, next) => {
    //para criar variáves globais
    res.locals.success_msg = req.flash("success_msg"),
        res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null
    next()
})

//Body Parser
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Handlebars
app.engine('handlebars', exhbs({ defaultLayout: "main", views: "./src/views" }));
app.set('view engine', 'handlebars');

// Mongoose
mongoose.connect(db.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Conectado ao MongoDB!")
}).catch((error) => {
    console.log("Erro ao se conectar: " + error)
})

//Public 
app.use(express.static(path.join(__dirname, "public")))

//Rotas

//eAdmin -> Verificar se o usuário tem permissão de administrador
app.use('/admin', eAdmin, require("./routes/admin"))
app.use("/usuarios", require("./routes/usuario"))
app.use("/", require("./src/routes/main"))


//Outros
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => {
    console.log("Servidor rodando!");
});


