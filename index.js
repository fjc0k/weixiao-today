const Koa = require('koa');
const koaJson = require('koa-json')({ pretty: false });
const render = require('koa-ejs');
const serve = require('koa-static');
const path = require('path');
const route = require('./routers');
const { port } = require('./config');

const app = new Koa();

render(app, {
  root: path.join(__dirname, './views'),
  layout: false,
  viewExt: 'html',
  cache: true,
  debug: false,
  delimiter: '?'
});

app.use(koaJson);

app.use(serve(path.join(__dirname, './views')));

route(app);

app.listen(port);
