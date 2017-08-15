const router = require('koa-router')();

require('./weixiao')(router);
require('./api')(router);

module.exports = app => app.use(router.routes()).use(router.allowedMethods());
