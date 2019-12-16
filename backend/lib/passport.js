const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('./database');
const helpers = require('./helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'nome',
    passwordField: 'senha',
    passReqToCallback: true
}, async(req, nome, senha, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE nome = ?', [nome]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(senha, user.senha)
        if (validPassword) {
            done(null, user, req.flash('success', 'Olá, ' + user.nome));
        } else {
            done(null, false, req.flash('message', 'Senha Incorreta.'));
        }
    } else {
        return done(null, false, req.flash('message', 'O Login não existe.'));
    }
}));
    

passport.use('local.signup', new LocalStrategy({
    usernameField: 'nome',
    passwordField: 'senha',
    passReqToCallback: true
}, async(req, nome, senha, done) => {

    const { login, email } = req.body;
    let newUser = {
        nome,
        email,
        senha
    };

    newUser.senha = await helpers.encryptPassword(senha);
    // Saving in the Database
    const result = await pool.query('INSERT INTO usuario SET ? ', newUser);
    newUser.id = result.insertId;
    return done(null, newUser, req.flash('success', 'Bem vindo' + newUser.nome));
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
    const rows = await pool.query('SELECT * FROM usuario WHERE id = ?', [id]);
    done(null, rows[0]);
});