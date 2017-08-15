const path = require('path');
const process = require('process');
const { cdn } = require('../config');

const isDev = process.env.NODE_ENV !== 'production';

module.exports = {
  dist: '../views/config',
  html: {
    title: '今天',
    template: path.join(__dirname, 'index.ejs')
  },
  homepage: (isDev ? '' : cdn) + '/config/',
  sourceMap: isDev,
  devServer: {
    setup(app) {
      app.post('/api/getConfig', (req, res) => {
        res.json({
          mediaId: 'gh_2a866851d1f9',
          message: '今天是[年]年[月]月[日]日。\n\n东北财经大学校历第[校历周]周，星期[星期]。\n\n[嘿哈]开学已经[已开学天数]天啦。',
          keywords: [ '今天' ],
          endDate: '',
          startDate: '',
          mediaInfo: {
            avatarImage: 'http://wx.qlogo.cn/mmopen/4BkqTem0HuQLQcSgTsa8upNErOia7GJQIKstang5JLXUGtMXby654EDficL4WSqNuJx4gWd3ib8AsxibNOkUjicgqLiaB11DqHLSDG/0',
            schoolName: '东北财经大学',
            mediaName: '冬菜助手Pro'
          }
        });
      });
      app.post('/api/saveConfig', (req, res) => {
        res.json({
          errcode: 0,
          errmsg: 'ok'
        });
      });
    }
  }
};
