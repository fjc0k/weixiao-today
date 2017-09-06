const { today } = require('../models');

exports.getConfig = async ctx => {
  const { token } = ctx.request.body;
  ctx.body = await today.getConfigByToken(token);
};

exports.saveConfig = async ctx => {
  const { token, config } = ctx.request.body;
  await today.saveConfigByToken(token, config);
  ctx.body = { msg: 'success' };
};
