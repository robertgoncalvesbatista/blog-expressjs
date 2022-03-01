const { Router } = require("express")

const routes = Router()

const UserController = require("../controllers/UserController")

// Se registrar ao sistema
routes.get("/register", (req, res) => res.render("usuarios/register"))
routes.post("/register", UserController.register)

// Logar ao sistema
routes.get("/login", (req, res) => res.render("usuarios/login"))
routes.post("/login", UserController.login)

// Deslogar do sistema
routes.get("/logout", UserController.logout);

module.exports = routes