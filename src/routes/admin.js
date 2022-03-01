const { Router } = require("express")

const Categoria = require("../models/Categoria")
const Postagem = require("../models/Postagem")

const { eAdmin } = require("../helpers/eAdmin") //{eAdmin}-> significa pegar apenas esta função

const routes = Router()

//Lista de categorias
routes.get("/categoria/readAll", eAdmin, (req, res) => {
    //Listar todas as categorias
    Categoria.find().sort({ date: 'desc' }).then((categorias) => {
        res.render("admin/categorias", { categorias: categorias })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias.")
        res.redirect("/admin")
    })
})

routes.get("/categorias/add", eAdmin, (req, res) => {
    res.render("admin/addcategorias")
})

//Salvar Categoria no banco
routes.post("/categoria/create", eAdmin, (req, res) => {
    var erros = []

    //Validação do formulário
    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome inválido" })
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.nome == null) {
        erros.push({ texto: "Slug inválido" })
    }

    if (req.body.nome.length < 2) {
        erros.push({ texto: "O nome da categoria é muito pequeno." })
    }

    if (erros.length > 0) {
        res.render("admin/addcategorias", { erros: erros })
    } else {

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!")
            res.redirect("/admin/categorias")
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao salvar a categoria, tenta novamente!")
            res.redirect("/admin")
        })
    }
})

// Página de edição de categoria
routes.get("/categoria/update/:id", eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).then((categoria) => {

        res.render("admin/editcategorias", { categoria: categoria })

    }).catch((error) => {

        req.flash("error_msg", "Essa categoria não existe.")
        res.redirect("/admin/categorias")
    })
})

// Editar categoria
routes.post("/categoria/update", eAdmin, (req, res) => {

    Categoria.findOne({ _id: req.body.id }).then((categoria) => {

        categoria.nome = req.body.nome,
            categoria.slug = req.body.slug

        categoria.save().then(() => {

            req.flash("success_msg", "Categoria editada com sucesso!")
            res.redirect("/admin/categorias")

        }).catch((error) => {

            req.flash("error_msg", "Houve um erro interno ao salvar a edição da categoria.")
            res.redirect("/admin/categorias")
        })

    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao editar categoria.")
        res.redirect("/admin/categorias")
    })

})

//Deletar categoria
routes.get("/categoria/delete/:id", eAdmin, (req, res) => {
    //id vindo do formulario em método post
    Categoria.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!")
        res.redirect("/admin/categorias")
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao deletar categoria.")
        res.redirect("/admin/categorias")
    })
})

// Postagens
// Listar postagens
routes.get("/postagem/readAll", eAdmin, (req, res) => {
    Postagem.find().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("admin/postagens", { postagens: postagens })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens.")
        res.redirect("/admin")
    })

})

// Página de criação de postagem
routes.get("/postagem/create", eAdmin, (req, res) => {
    Categoria.find().then((categorias) => {
        res.render("admin/addpostagem", { categorias: categorias })
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário")
        res.redirect("/admin")
    })
})

// Salvar postagem
routes.post("/postagem/create", eAdmin, (req, res) => {
    var erros = []

    if (req.body.categoria === '0') {
        erros.push({ texto: 'Categoria inválida, registra uma categoria' })
    }

    if (erros.length > 0) {
        //mostrar na tela, caso dê algum tipo de erro
        res.render('admin/addpostagem', { erros: erros });
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            autor: req.body.autor
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem criada com sucesso.")
            res.redirect("/admin/postagens")
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao cadastrar postagem, tente novamente.")
            res.redirect("/admin/postagens")
        })
    }

})

// Página de edição de postagem
routes.get("/postagem/update/:id", eAdmin, (req, res) => {
    //Buscar em seguidas
    Postagem.findOne({ _id: req.params.id }).then((postagem) => {

        Categoria.find().then((categorias) => {
            res.render("admin/editpostagens", { categorias: categorias, postagem: postagem })
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao listar as categorias.")
            res.redirect("/admin/postagens")
        })


    }).catch((error) => {
        req.flash("error_msg", "Houve um erro ao carregar o formulário de edição.")
        res.redirect("/admin/postagens")
    })

})

// Editar postagem
routes.post("/postagem/update", eAdmin, (req, res) => {
    Postagem.findOne({ _id: req.body.id }).then((postagem) => {
        postagem.titulo = req.body.titulo,
            postagem.slug = req.body.slug,
            postagem.descricao = req.body.descricao,
            postagem.conteudo = req.body.conteudo,
            postagem.categoria = req.body.categoria
        postagem.autor = req.body.autor

        postagem.save().then(() => {
            req.flash("success_msg", "Postagem editada com sucesso.")
            res.redirect("/admin/postagens")
        }).catch((error) => {
            req.flash("error_msg", "Houve um erro ao editar a postagem.")
            res.redirect("/admin/postagens")
        })
    }).catch((error) => {
        console.log(error)
        req.flash("error_msg", "Houve um erro ao salvar a edição.")
        res.redirect("/admin/postagens")
    })
})

// Deletar postagem 
routes.get("/postagem/delete/:id", eAdmin, (req, res) => {
    Postagem.remove({ _id: req.params.id }).then(() => {
        req.flash("error_msg", "Postagem deletada com sucesso.")
        res.redirect("/admin/postagens")
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno.")
        res.redirect("/admin/postagens")
    })
})

module.exports = routes;