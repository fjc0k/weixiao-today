const Koa = require('koa');
const koaJson = require('koa-json')({ pretty: false });
const render = require('koa-ejs');
const serveStatic = require('koa-static');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const route = require('./routers');
const { port } = require('./config');

const app = new Koa();

app.use(async (ctx, next) => {
  // fuck: 微校提交的请求内容本身和 content-type 不一致
  if (ctx.path === '/weixiao') {
    ctx.disableBodyParser = true;
  }
  await next();
});
app.use(bodyParser());

render(app, {
  root: path.join(__dirname, './views'),
  layout: false,
  viewExt: 'html',
  cache: true,
  debug: false,
  delimiter: '?'
});

app.use(koaJson);

app.use(
  serveStatic(
    path.join(__dirname, './views'),
    { maxage: 2592000000 /* 单位: 毫秒, 30天 */ }
  )
);

route(app);

app.listen(port);
