const bcrypt = require("bcryptjs")
const passport = require("passport")

const User = require("../models/User")

module.exports = {
    async register(req, res) {
        var erros = []

        //Validação de dados do formulário
        if (!req.body.name || typeof req.body.name == undefined || req.body.name == null) {
            erros.push({ texto: "name inválido" })
        }

        if (!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
            erros.push({ texto: "E-mail inválido" })
        }

        if (!req.body.password || typeof req.body.password == undefined || req.body.password == null) {
            erros.push({ texto: "password inválida" })
        }

        //Verificar se a password tem menos que 4 caracteres
        if (req.body.password.length < 4) {
            erros.push({ texto: "password muito curta!" })
        }

        //Verificar se a password repetida é diferente 
        if (req.body.password != req.body.password2) {
            erros.push({ texto: "As passwords são diferentes, tente novamente." })
        }

        if (erros.length > 0) {
            res.render("usuarios/register", { erros: erros })
        } else {
            User.findOne({ email: req.body.email }).then((usuario) => {
                if (usuario) {
                    req.flash("error_msg", "Já existe uma conta com esse e-email no nosso sistema.")
                    res.redirect("/auth/register")
                } else {
                    const newUser = new User({
                        name: req.body.name,
                        email: req.body.email,
                        password: req.body.password
                    })

                    //Gerar HASH de password
                    //Salt -> um valor aleatório misturado com hash
                    bcrypt.genSalt(10, (erro, salt) => {
                        bcrypt.hash(newUser.password, salt, (erro, hash) => {
                            if (erro) {
                                req.flash("error_msg", "Houve um erro ao cadastrar usuário.")
                                res.redirect("/")
                            }

                            newUser.password = hash

                            newUser.save().then(() => {
                                req.flash("success_msg", "Usuário cadastrado com sucesso. ")
                                res.redirect("/")
                            }).catch((error) => {
                                req.flash("error_msg", "Houve um erro ao cadastrar usuário.")
                                res.redirect("/")
                            })
                        })
                    })
                }
            }).catch((error) => {
                req.flash("error_msg", "Houve um erro interno.")
                res.redirect("/")
            })
        }
    },
    async login(req, res, next) {
        //Autenticar usuário
        passport.authenticate("local", {
            successRedirect: "/", // se autenticação ocorrer com sucesso
            successFlash: true,
            failureRedirect: "/auth/login", // se ocorrer alguma falha na autenticação
            failureFlash: true
        })(req, res, next)
    },
    async logout(req, res) {
        req.logout()
        req.flash("success_msg", "Deslogado com sucesso!")
        res.redirect("/")
    }
}