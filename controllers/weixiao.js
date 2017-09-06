const weixiaoController = require('koa-weixiao-controller');
const { SchoolCalendar } = require('../services');
const { weixiao: api } = require('../config');
const { today } = require('../models');

module.exports = weixiaoController({
  api: api,
  hooks: {
    async open(ctx, { mediaId, Weixiao }) {
      await today.open(mediaId);
      ctx.body = Weixiao.generateResponse({
        token: api.token,
        is_config: 1
      });
    },
    async trigger(ctx, { body: wechatMessage, mediaId }) {
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
    },
    async keyword(ctx, { body, mediaId }) {
      await today.updateKeywords(mediaId, body.keyword);
    },
    async config(ctx, { mediaId }) {
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
    }
  }
});
