const weixiaoController = require('../controllers').weixiao;

module.exports = router => router.all('/weixiao', weixiaoController.index);
