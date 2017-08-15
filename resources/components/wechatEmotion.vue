<template>
  <span class="wechatEmotion" :style="{
    backgroundPosition: `0 ${wechatEmotions[name]}px`
  }"></span>
</template>

<script>
  import wechatEmotions from '../store/wechatEmotions';
  export default {
    props: ['name'],
    data() {
      return {
        wechatEmotions
      };
    }
  }
</script>

<style>
  .wechatEmotion {
    width: 20px;
    height: 20px;
    vertical-align: middle;
    display: inline-block;
    background: transparent url(../assets/wechat-emotions.png) no-repeat 0 0;
    -webkit-background-size: 20px auto;
    background-size: 20px auto;
  }
</style>
