const md5 = require('md5');
const axios = require('axios');
const moment = require('moment');
const randomstring = require('randomstring');
const crypto = require('crypto');
const _ = require('lodash');

module.exports = class Weixiao {
  /**
   * 构造函数
   * @param  {Object} api 微校 api
   */
  constructor(api) {
    this.defaultExcludeKeys = ['type', 'sign', 'keyword'];
    this.apiUrls = {
      mediaInfo: 'http://weixiao.qq.com/apps/v1/data/media-info',
      mediaKeywords: 'http://weixiao.qq.com/apps/v1/data/media-keywords'
    };
    this.setApi(api);
  }

  /**
   * 设置 api
   * @param {Object} api 新 api
   */
  setApi(api) {
    this.api = api;
  }

  /**
   * 获取 api
   * @return {Object} 微校 api
   */
  getApi() {
    return this.api;
  }

  /**
   * 微校开放平台签名
   * @param  {Object} params      待签名的参数
   * @param  {Array} excludeKeys 不参与签名的参数
   * @return {String}             签名
   */
  sign(params, excludeKeys) {
    const signParams = _.omit(params, excludeKeys || this.defaultExcludeKeys);
    const signStrings = _
                         .keys(signParams)
                         .sort()
                         .map(k => `${k}=${signParams[k]}`);
    signStrings.push(`key=${this.api.secret}`);
    const signString = signStrings.join('&');
    return md5(signString).toUpperCase();
  }

  /**
   * 微信公众平台签名
   * @param  {Object} params 待签名参数
   * @return {String}        签名
   */
  wechatSign(params) {
    const shasum = crypto.createHash('sha1');
    const arr = [
      this.api.token,
      params.timestamp,
      params.nonce
    ].sort();
    shasum.update(arr.join(''));
    return shasum.digest('hex');
  }

  /**
   * 检查签名(自动识别微校 or 微信)
   * @param  {Object} params      待签名的参数(含原签名)
   * @param  {Array} excludeKeys 不参与签名的参数
   * @return {Boolean}             签名是否正确
   */
  checkSign(params, excludeKeys) {
    if (params.signature) {
      return this.wechatSign(params) === params.signature;
    } else {
      return this.sign(params, excludeKeys) === params.sign;
    }
  }

  /**
   * 检查时间间隔是否正常
   * @param  {Object} params           参数
   * @param  {Number} [maxInterval=60] 最大时间间隔(秒)
   * @return {Boolean}                  检查结果
   */
  static checkInterval(params, maxInterval = 60) {
    if (!params.timestamp) return false;
    const interval = moment().unix() - params.timestamp;
    return interval <= maxInterval;
  }

  /**
   * 获取错误码的具体信息
   * @param  {Number} errorCode 错误码
   * @return {String}           错误信息
   */
  static getErrorMessage(errorCode) {
    const errorObj = {
         0: '请求成功',
      5001: '请求微校接口失败',
      5002: '公众号不存在',
      5003: '请求接口失败',
      5004: '签名验证不通过',
      5005: '公众号未开启应用',
      5006: '请求接口参数错误',
      5007: '关键词同步异常，请稍候再试'
    };
    return errorObj[errorCode] || '未知错误';
  }

  /**
   * 生成响应内容
   * @param  {Object} params        响应参数
   * @param  {Number} [errorCode=0] 错误码
   * @return {Object}               响应内容
   */
  static generateResponse(params, errorCode = 0) {
    return _.assign({
      errcode: errorCode,
      errmsg: Weixiao.getErrorMessage(errorCode)
    }, params);
  }

  /**
   * 生成请求内容
   * @param  {Object} params 请求参数
   * @return {Object}        请求内容
   */
  generateRequest(params) {
    const requestObj = _.assign({
      api_key: this.api.key,
      timestamp: moment().unix(),
      nonce_str: randomstring.generate(32)
    }, params);
    requestObj.sign = this.sign(requestObj, this.api.secret);
    return requestObj;
  }

  /**
   * 获取公众号信息
   * @param  {String}  mediaId 公众号 ID
   * @return {Object}         公众号信息
   */
  async getMediaInfo(mediaId) {
    const requestObj = this.generateRequest({
      media_id: mediaId
    });
    const { data } = await axios.post(this.apiUrls.mediaInfo, requestObj);
    if (data.errcode && data.errcode !== 0) {
      throw new Error(data.errmsg);
    } else {
      return data;
    }
  }

  /**
   * 获取关键词
   * @param  {String}  mediaId 公众号 ID
   * @return {Array}         关键词数组
   */
  async getMediaKeywords(mediaId) {
    const requestObj = this.generateRequest({
      media_id: mediaId
    });
    const { data } = await axios.post(this.apiUrls.mediaKeywords, requestObj);
    if (data.errcode && data.errcode !== 0) {
      throw new Error(data.errmsg);
    } else {
      return data.keyword.split(',');
    }
  }

};
