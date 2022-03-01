const { Router } = require("express")
const routes = Router()

const Postagem = require("../models/Postagem")
const Categoria = require("../models/Categoria")

//Rota Principal
routes.get("/", (req, res) => {
    Postagem.find().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("index", { postagens: postagens })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno.")
        res.redirect("/404")
    })
})

//Postagem - Leia Mais
routes.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({ slug: req.params.slug }).then((postagem) => {

        if (postagem) {
            res.render("postagem/index", { postagem: postagem })
        } else {
            req.flash("error_msg", "Está postagem não existe.")
            res.redirect("/")
        }

    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno.")
        res.redirect("/")
    })
})

//Listagem de categorias
routes.get("/categorias", (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("categorias/index", { categorias: categorias })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno ao listar as categorias.")
        res.redirect("/")
    })
})

//Listar postagens pertencentes a uma certa categoria
routes.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({ slug: req.params.slug }).then((categoria) => {

        if (categoria) {

            Postagem.find({ categoria: categoria._id }).then((postagens) => {

                res.render("categorias/postagens", { postagens: postagens, categoria: categoria })

            }).catch((error) => {

                req.flash("error_msg", "Houve um erro ao listar as postagens.")
                res.redirect("/")
            })

        } else {

            req.flash("error_msg", "Essa categoria não existe.")
            res.redirect("/")

        }

    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno ao carregar a página dessa categoria.")
        res.redirect("/")
    })
})

//Rota de erro
routes.get("/404", (req, res) => {
    res.send("Error 404!")
})

module.exports = routes