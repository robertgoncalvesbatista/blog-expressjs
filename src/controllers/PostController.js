const Post = require("../models/Post")

module.exports = {
    async create(req, res) {
        var erros = []

        if (req.body.category === '0') {
            erros.push({ texto: 'Categoria inválida, registra uma categoria' })
        }

        if (erros.length > 0) {
            //mostrar na tela, caso dê algum tipo de erro
            res.render('postagens/create', { erros: erros });
        } else {
            const newPost = {
                title: req.body.title,
                slug: req.body.slug,
                description: req.body.description,
                content: req.body.content,
                category: req.body.category,
                author: req.body.author
            }

            new Post(newPost).save().then(() => {
                req.flash("success_msg", "Postagem criada com sucesso.")
                res.redirect("/")
            }).catch((error) => {
                req.flash("error_msg", "Houve um erro ao cadastrar postagem, tente novamente.")
                res.redirect("/")
            })
        }
    },
    async read(req, res) {
        Post.findOne({ slug: req.params.slug }).then((post) => {
            if (post) {
                res.render("postagens/read", { post: post })
            } else {
                req.flash("error_msg", "Está postagem não existe.")
                res.redirect("/")
            }
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno.")
            res.redirect("/")
        })
    },
    async update(req, res) {
        Post.findOne({ _id: req.body.id }).then((post) => {
            post.title = req.body.title
            post.slug = req.body.slug
            post.description = req.body.description
            post.content = req.body.content
            post.category = req.body.category
            post.author = req.body.author

            post.save().then(() => {
                req.flash("success_msg", "Post edited succesfully!")
                res.redirect("/")
            }).catch((error) => {
                req.flash("error_msg", "There's an error on save the edition of post!")
                res.redirect("/")
            })
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno.")
            res.redirect("/")
        })
    },
    async delete(req, res) {
        Post.deleteOne({ _id: req.params.id }).then(() => {
            req.flash("error_msg", "Postagem deletada com sucesso.")
            res.redirect("/")
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro interno.")
            res.redirect("/")
        })
    }
}