const localStrategy = require("passport-local")
const bcrypt = require("bcryptjs")

//Model de Usuário
const User = require("../models/User")

module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: 'email', passwordField: 'password' }, (email, password, done) => {
        User.findOne({ email: email }).then((user) => {
            if (!user) {
                return done(null, false, { message: "Esta conta não existe" })
            }

            bcrypt.compare(password, user.password, (error, match) => {
                if (match) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: "Usuário ou password incorreta" })
                }
            })
        })
    }))

    //Salvar os dados do usuário em uma sessão
    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        //Procurar um usuário pelo ID dele
        User.findById(id, (error, user) => {
            done(error, user)
        })
    })
}