const router = new require('koa-router')();

const indexController = require('../controlllers/index');

router.get('/', indexController.index);
router.get('/about', indexController.about);


module.exports = router;