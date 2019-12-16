const controller = {};

const passport = require('passport');
require('../lib/passport');

controller.login = (req, res) => {
    res.render('login')
}

controller.home = (req, res) => {
    res.render('home')
}

controller.cadastro = (req, res) => {
    res.render('cadastro')
}

controller.registar = (req, res) => {
    const nome = req.body.nome;
    const email = req.body.email;

    req.getConnection((err, connection) => {
        const query = connection.query('SELECT * FROM db.usuario WHERE nome= ? ;', nome, (err, result) => {

            const query1 = connection.query('SELECT * FROM db.usuario WHERE email= ? ', email, (err, result1) => {

                const linhas = (Object.keys(result).length);

                const linhas1 = (Object.keys(result1).length);

                if (linhas > 0)
                    res.render('login', {
                        message: 'Login: ' + nome + ' já existe.'
                    })
                else if (linhas1 > 0)
                    res.render('login', {
                        message: 'Email: ' + email + ' já existe.'
                    })
                else
                    passport.authenticate('local.signup', {
                        successRedirect: '/home', 
                        failureRedirect: '/',
                        failureFlash: true
                    })(req, res);
            })
        })
    })
};

controller.logar = (req, res) => {
    const { check, validationResult } = require('express-validator');
    check('nome',).not().isEmpty();
    check('senha',).not().isEmpty();
    const errors = validationResult(req);
    if (errors.length > 0) {
        req.send('message', errors[0].msg);
        res.redirect('/signin');
    }
    passport.authenticate('local.signin', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })(req, res);
};

controller.logout = (req, res) => {
    req.logOut();
    res.redirect('/');
}

module.exports = controller;