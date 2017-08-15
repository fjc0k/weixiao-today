const { Body, Weixiao } = require('../services');
const { today } = require('../models');

exports.getConfig = async ctx => {
  const { token } = await new Body(ctx).parseJSON();
  ctx.body = await today.getConfigByToken(token);
};

exports.saveConfig = async ctx => {
  const { token, config } = await new Body(ctx).parseJSON();
  await today.saveConfigByToken(token, config);
  ctx.body = Weixiao.generateResponse({});
};
