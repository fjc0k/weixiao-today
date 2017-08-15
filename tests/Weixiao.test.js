const Weixiao = require('../services/Weixiao');

const api = {
  key: '8EB9E087BA5A160A',
  secret: '4FB9AEC06428D4AF37516827F9FFD905'
};

const testMedia = {
  media_id: 'gh_2a866851d1f9',
  name: '冬菜助手Pro'
};

const wx = new Weixiao(api);

test('sign', () => {
  expect(wx.sign(testMedia))
    .toBe('68FFDBF4277516DBF51E833B5A3A89B3');
});

test('checkSign', () => {
  expect(wx.checkSign(testMedia, '68FFDBF4277516DBF51E833B5A3A89B3'))
    .toBe(true);
});

test('getErrorMessage', () => {
  expect(Weixiao.getErrorMessage(5006))
    .toBe('请求接口参数错误');
});

test('generateResponse', () => {
  expect(Weixiao.generateResponse({
    reply_text: 'hello'
  }, 5006)).toEqual({
    errcode: 5006,
    errmsg: '请求接口参数错误',
    reply_text: 'hello'
  });
});

test('generateRequest', () => {
  expect(Object.keys(wx.generateRequest({
    request_text: 'hello'
  }))).toEqual(expect.arrayContaining([
    'api_key', 'timestamp', 'nonce_str', 'sign', 'request_text'
  ]))
});

test('getMediaInfo', async () => {
  expect(await wx.getMediaInfo(testMedia.media_id))
    .toEqual(expect.objectContaining(testMedia));
});

test('getMediaKeywords', async () => {
  expect(await wx.getMediaKeywords(testMedia.media_id))
    .toEqual(expect.arrayContaining([
      '$test1', '$test2', '$test3'
    ]));
});
