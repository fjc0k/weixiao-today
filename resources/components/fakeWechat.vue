<template>
  <div class="fakeWechat">

    <!-- 头部 -->
    <div class="fakeWechat-header">
      <div>
        <Icon type="chevron-left"></Icon> 微信({{ config.unreads }})
      </div>
      <div class="fakeWechat-title">{{ config.title }}</div>
      <Icon type="person"></Icon>
    </div>

    <!-- 消息列表 -->
    <div class="fakeWechat-body">
      <div class="bubble" :class="chatSides[chat.from].position" v-for="(chat, index) in chatList" :key="index">
        <a class="avatar" href="javascript:;">
          <img :src="chatSides[chat.from].avatar" :alt="chatSides[chat.from].nickname" />
        </a>
        <div class="wrap">
          <div class="content" v-html="chat.message"></div>
        </div>
      </div>
    </div>

    <!-- 底部 -->
    <div class="fakeWechat-footer">
      <div>
        <icon name="switch"></icon>
      </div>
      <div class="fakeWechat-footer__separator"></div>
      <div>
        <icon name="voice"></icon>
      </div>
      <div class="fakeWechat-footer__input">
        <input type="text">
      </div>
      <div>
        <icon name="emotion"></icon>
      </div>
      <div>
        <icon name="extra"></icon>
      </div>
    </div>

  </div>
</template>

<script>
  import icon from './icon';

  export default {
    components: { icon },
    props: {
      config: {
        type: Object,
        default: () => {
          return {
            title: '效果预览',
            unreads: 521
          }
        }
      },
      chatSides: Object,
      chatList: Array
    }
  }
</script>

<style lang="less">

  @bodyBgColor: #eee;
  @footerBorderColor: darken(@bodyBgColor, 10%);

  .fakeWechat {
    position: relative;
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      background: #393a3d;
      color: white;
    }
    &-title {
      font-size: 1.4em;
      flex: 1;
      margin: 0 10px;
      overflow: hidden;
      -webkit-line-clamp: 1;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      text-align: center;
    }
    &-body {
      height: 400px;
      padding-bottom: 60px;
      background-color: @bodyBgColor;
      overflow-y: auto;
      &::-webkit-scrollbar { // 隐藏滚动条
        display: none;
      }
    }
    &-footer {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      font-size: 22px;
      color: #777;
      border-top: .5px solid @footerBorderColor;
      background: lighten(@bodyBgColor, 3%);
      > div {
        padding: 5px 3px;
      }
      &__separator {
        &:before {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          border-right: .5px solid @footerBorderColor;
        }
      }
      &__input {
        flex: 1;
        > input {
          width: 100%;
          border: .5px solid #dddee1;
          border-radius: 4px;
        }
      }
    }
  }
  .bubble {
    padding: 6px;
    overflow: hidden;
    position: relative;
  }
  .bubble:after {
    clear: both;
    content: '';
  }
  .bubble a.avatar {
    display: block;
    height: 44px;
    width: 44px;
    border-radius: 2px;
    overflow: hidden;
    cursor: default;
  }
  .bubble a.avatar > img {
    width: 100%;
    height: 100%;
  }
  .bubble.left a.avatar {
    float: left;
  }
  .bubble.right a.avatar {
    float: right;
  }
  .bubble .content {
    width: auto;
    padding: 0.7em 0.5em;
    font-size: 16px;
    border-radius: 6px;
    border: 1px solid;
    position: relative;
    display: inline-block;
  }
  .bubble .content:before {
    content: '';
    display: inline-block;
    box-sizing: border-box;
    width: 12px;
    height: 12px;
    border: 1px solid transparent;
    border-radius: 3px;
    position: absolute;
    background-color: inherit;
    border-right-color: inherit;
    border-bottom-color: inherit;
  }
  .bubble.left {
    text-align: left;
  }
  .bubble.right {
    text-align: right;
  }
  .bubble.left .wrap {
    margin-left: 56px;
    margin-right: 56px;
  }
  .bubble.left .content {
    background: #fafafa;
    border-color: #c6c6c6;
  }
  .bubble.left .content:before {
    left: -6px;
    top: 16px;
    transform: rotate(135deg);
  }
  .bubble.right .wrap {
    margin-right: 56px;
    margin-left: 56px;
  }
  .bubble.right .content {
    background: #b3e866;
    border-color: #9ab96b;
    text-align: left;
  }
  .bubble.right .content:before {
    right: -6px;
    top: 16px;
    transform: rotate(-45deg);
  }
  .bubble .content {
    white-space: pre-wrap;
    word-break: break-all;
  }
</style>
