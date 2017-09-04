const Weixiao = require('weixiao.js');
const { Body, SchoolCalendar } = require('../services');
const { weixiao: api } = require('../config');
const { today } = require('../models');
const _ = require('lodash');

const wx = new Weixiao(api);

exports.index = async ctx => {
  const { type } = ctx.query;
  if (!type || !this[type]) {
    ctx.body = Weixiao.generateResponse({}, 5006);
  } else {
    ctx.body = await new Body(ctx)[
      type === 'trigger' ? 'parseWechatXML' : 'parseJSON'
    ]();
    const checks = {
      open: 'body',
      close: 'body',
      trigger: 'query',
      keyword: 'body',
      config: 'query'
    };
    if (checks[type]) {
      const checkContent = ctx[checks[type]];
      if (Weixiao.checkInterval(checkContent) && wx.checkSign(checkContent)) {
        await this[type](ctx, checkContent.media_id);
      } else {
        ctx.body = Weixiao.generateResponse({}, 5006);
      }
    } else {
      await this[type](ctx);
    }
  }
};

exports.open = async (ctx, mediaId) => {
  await today.open(mediaId);
  ctx.body = Weixiao.generateResponse({
    token: api.token,
    is_config: 1
  });
};

exports.close = async (ctx, mediaId) => {
  await today.close(mediaId);
  ctx.body = Weixiao.generateResponse({});
};

exports.trigger = async (ctx, mediaId) => {
  const wechatMessage = ctx.body;
  const config = await today.getConfig(mediaId);
  const replyMessage =
    !config.startDate ?
      '提示：请先到管理界面配置开学日期再使用“今天”应用。' :
        new SchoolCalendar(config).parseText(config.message);
  ctx.body =
`<xml>
<ToUserName><![CDATA[${wechatMessage.FromUserName}]]></ToUserName>
<FromUserName><![CDATA[${wechatMessage.ToUserName}]]></FromUserName>
<CreateTime>${wechatMessage.CreateTime}</CreateTime>
<MsgType><![CDATA[text]]></MsgType>
<Content><![CDATA[${replyMessage}]]></Content>
</xml>`;
};

exports.monitor = async ctx => ctx.body = ctx.query.echostr;

exports.keyword = async (ctx, mediaId) => {
  await today.updateKeywords(mediaId, ctx.body.keyword);
  ctx.body = Weixiao.generateResponse({});
};

exports.config = async (ctx, mediaId) => {
  const config = await today.getConfig(mediaId);
  if (!config.mediaInfo.mediaName) {

    // 公众号信息获取与更新
    const mediaInfo = await wx.getMediaInfo(mediaId);
    await today.updateMediaInfo(mediaId, {
      mediaName: mediaInfo.name,
      schoolName: mediaInfo.school_name,
      avatarImage: mediaInfo.avatar_image
    });

    // 关键词获取与更新
    const keywords = await wx.getMediaKeywords(mediaId);
    await today.updateKeywords(mediaId, keywords);

    // 学校名字替换
    await today.saveConfig(mediaId, {
      message: config.message.replace(/\[学校\]/g, mediaInfo.school_name)
    });
  }

  // 以签名作为 token
  const token = ctx.query.sign;
  await today.setToken(mediaId, token);

  await ctx.render('config/index', { token });
};
