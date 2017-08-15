import wechatEmotions from '../store/wechatEmotions';

export default text => {
  Object.keys(wechatEmotions).forEach(name => {
    text = text.replace(
      new RegExp(`\\[${name}\\]`, 'g'),
      `<span class="wechatEmotion" style="background-position: 0 ${wechatEmotions[name]}px"></span>`
    );
  });
  return text;
}
