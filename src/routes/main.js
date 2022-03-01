const { Router } = require("express")

const Post = require("../models/Post")
const Category = require("../models/Category")

const { eAdmin } = require("../helpers/eAdmin") //{eAdmin}-> significa pegar apenas esta função

const CategoryController = require("../controllers/CategoryController")
const PostController = require("../controllers/PostController")

const routes = Router()

// Rota principal
routes.get("/", (req, res) => {
    Post.find().populate("categoria").sort({ data: "desc" }).then((post) => {
        res.render("index", { post: post })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno.")
        res.redirect("/404")
    })
})

/* Routes e controllers de categorias */

// Página de criação de categoria
routes.get("/categoria/create", eAdmin, (req, res) => res.render("categorias/create"))

// Página listagem de categorias
routes.get("/categoria/readAll", eAdmin, (req, res) => {
    Category.find().sort({ date: 'desc' }).then((category) => {
        res.render("categorias/index", { category: category })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias.")
        res.redirect("/categorias")
    })
})

// Página de edição de categoria
routes.get("/categoria/update/:id", eAdmin, (req, res) => {
    Category.findOne({ _id: req.params.id }).then((category) => {
        res.render("categorias/update", { category: category })
    }).catch((error) => {
        req.flash("error_msg", "Essa categoria não existe.")
        res.redirect("/")
    })
})

// Salvar Categoria no banco
routes.post("/categoria/create", eAdmin, CategoryController.create)

// Listar postagens pertencentes a uma certa categoria
routes.get("/categoria/:slug", CategoryController.read)

// Editar categoria
routes.post("/categoria/update", eAdmin, CategoryController.update)

// Deletar categoria
routes.get("/categoria/delete/:id", eAdmin, CategoryController.delete)

/* Routes e controllers de postagens */

// Página de criação de postagem
routes.get("/postagem/create", eAdmin, (req, res) => {
    Category.find().then((category) => {
        res.render("postagens/create", { category: category })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/")
    })
})

// Página de listagem de postagens
routes.get("/postagem/readAll", eAdmin, (req, res) => {
    Post.find().populate("category").sort({ data: "desc" }).then((post) => {
        res.render("postagens/index", { post: post })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens.")
        res.redirect("/")
    })
})

// Página de edição de postagem
routes.get("/postagem/update/:id", eAdmin, (req, res) => {
    Post.findOne({ _id: req.params.id }).then((post) => {
        Category.find().then((category) => {
            res.render("postagens/update", { category: category, post: post })
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias.")
            res.redirect("/")
        })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição.")
        res.redirect("/")
    })
})

// Salvar postagem
routes.post("/postagem/create", eAdmin, PostController.create)

// Ler postagem
routes.get("/postagem/:slug", PostController.read)

// Editar postagem
routes.post("/postagem/update", eAdmin, PostController.update)

// Deletar postagem 
routes.get("/postagem/delete/:id", eAdmin, PostController.delete)

module.exports = routes