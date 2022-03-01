const Category = require("../models/Category")

module.exports = {
    async create(req, res) {
        var erros = []

        if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
            erros.push({ texto: "name inválido" })
        }

        if (!req.body.slug || typeof req.body.slug == undefined || req.body.name == null) {
            erros.push({ texto: "Slug inválido" })
        }

        if (erros.length > 0) {
            res.render("categorias/create", { erros: erros })
        } else {
            const newCategory = {
                name: req.body.name,
                slug: req.body.slug
            }

            new Category(newCategory).save().then(() => {
                req.flash("success_msg", "Category created succesfully!")
                res.redirect("/")
            }).catch((error) => {
                req.flash("error_msg", "Houve um erro ao salvar a category, tenta novamente!")
                res.redirect("/")
            })
        }
    },
    async read(req, res) {
        Category.findOne({ slug: req.params.slug }).then((category) => {
            if (category) {
                Post.find({ category: category._id }).then((post) => {
                    res.render("categorias/postagens", { post: post, category: category })
                }).catch((error) => {
                    req.flash("error_msg", "Houve um erro ao listar as postagens.")
                    res.redirect("/")
                })
            } else {
                req.flash("error_msg", "This category not exist!")
                res.redirect("/")
            }
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno ao carregar a página dessa categoria.")
            res.redirect("/")
        })
    },
    async update(req, res) {
        Category.findOne({ _id: req.body.id }).then((category) => {
            category.nome = req.body.nome;
            category.slug = req.body.slug;

            category.save().then(() => {
                req.flash("success_msg", "Category edited succesfully!")
                res.redirect("/")
            }).catch((error) => {
                req.flash("error_msg", "There's an error on save the edition of category!")
                res.redirect("/")
            })
        }).catch((error) => {
            req.flash("error_msg", "There's an error on edit category!")
            res.redirect("/")
        })

    },
    async delete(req, res) {
        Category.deleteOne({ _id: req.params.id }).then(() => {
            req.flash("success_msg", "Category deleted succesfully!")
            res.redirect("/")
        }).catch((error) => {
            req.flash("error_msg", "There's an error on delete category!")
            res.redirect("/")
        })
    }
}