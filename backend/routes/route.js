const router = require('express').Router();

const { isLoggedIn } = require('../lib/auth')

const controller = require('../controllers/controller');

router.get('/', controller.login);

router.get('/home',  isLoggedIn, controller.home);

router.get('/logout', controller.logout);

router.post('/logar', controller.logar);

router.post('/registrar', controller.registar);

router.get('/cadastro', controller.cadastro);

module.exports = router;