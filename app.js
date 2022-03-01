require("dotenv").config()
require("./src/config/db")

//Carregando módulos
const express = require("express")
const session = require("express-session")
const flash = require("connect-flash")
const exhbs = require("express-handlebars")
const Handlebars = require("handlebars")

const { allowInsecurePrototypeAccess } = require("@handlebars/allow-prototype-access")

const app = express()

const passport = require("passport")
require("./src/config/auth")(passport)

// Configurar session
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 },
    resave: false
}))

// Configurar passport
app.use(passport.initialize())
app.use(passport.session())

// Configurar o flash
app.use(flash())

// Configurar parser JSON
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Public
app.use(express.static(__dirname + "/src/public"))

// Configurar middlewares
app.use((req, res, next) => {
    // Criar variáveis globais
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.user = req.user || null
    next()
})

// Configurar handlebars
app.engine("handlebars", exhbs({
    defaultLayout: "main",
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}))
app.set("view engine", "handlebars")
app.set("views", "./src/views")

// Routes
app.use("/", require("./src/routes/main"))
app.use("/auth", require("./src/routes/auth"))

// Server
app.listen(process.env.PORT || 3000, () =>
    console.log(`Server is running... http://localhost:${process.env.PORT}`)
)