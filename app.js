require('dotenv').config()
require("./src/config/db")

//Carregando módulos
const express = require("express")
const session = require("express-session")
const flash = require("connect-flash")
const exhbs = require("express-handlebars")
const path = require("path")

const app = express()

const passport = require("passport")
require("./config/auth")(passport)

const { eAdmin } = require("./helpers/eAdmin") //{eAdmin}-> significa pegar apenas esta função    

// Configurar session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
}))

// Configurar passport
app.use(passport.initialize())
app.use(passport.session())

// Configurar o flash
app.use(flash())

// Configurar middlewares
app.use((req, res, next) => {
    // Criar variáveis globais
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.user = req.user || null
    next()
})

// Configurar parser JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Configurar handlebars
app.engine('handlebars', exhbs({ defaultLayout: "main" }));
app.set('view engine', 'handlebars');
app.set('views', './src/views');

// Public
app.use(express.static(path.join(__dirname, "public")))

// Routes
app.use("/", require("./src/routes/main"))
app.use('/admin', eAdmin, require("./routes/admin"))    // eAdmin => Verificar se o usuário tem permissão de administrador
app.use("/usuarios", require("./routes/usuario"))

// Server
app.listen(process.env.PORT || 8081, () => {
    console.log("Servidor rodando!");
});