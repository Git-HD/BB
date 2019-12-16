const express = require('express');
  path = require('path'),
  morgan = require('morgan'),
  mysql = require('mysql'),
  myConnection = require('express-myconnection');

const passport = require('passport');
const app = express();

const session = require('express-session')
const flash = require('connect-flash');

// Tira o cache para logar novamente
const nocache = require('nocache')
app.use(nocache())

const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({
  extended: true
}))

const TWO_HOURS = 1000 * 60 * 60 * 2
const { PORT = 3000, NODE_ENV = 'development', SESS_NAME = 'sid', SESS_SECRET = 'ssh!quiet,it\'asecret', SESS_LIFETIME = TWO_HOURS } = process.env
const IN_PROD = NODE_ENV == 'production'

app.use(session({
  name: SESS_NAME,
  resave: false,
  saveUninitialized: false,
  secret: SESS_SECRET,
  cookie: {
      maxAge: SESS_LIFETIME,
      sameSite: true,
      secure: IN_PROD
  }
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    app.locals.message = req.flash('message');
    app.locals.success = req.flash('success');
    app.locals.user = req.user;
    next();
});

const Routes = require('./routes/route');

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use(myConnection(mysql, {
  host: 'localhost',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'db'
}, 'single'))

app.use('/', Routes)

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`server on port ${app.get('port')}`);
});
