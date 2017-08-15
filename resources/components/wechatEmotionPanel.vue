<template>
  <div class="wechatEmotionPanel">
    <Tooltip
      v-for="name in names"
      :key="name"
      :content="name"
      placement="top-start"
      :transfer="true"
    >
      <wechatEmotion :name="name" @click.native="$emit('chose', name)"></wechatEmotion>
    </Tooltip>
  </div>
</template>

<script>
  import wechatEmotion from './wechatEmotion.vue';
  import wechatEmotions from '../store/wechatEmotions';

  const names = Object.keys(wechatEmotions);

  export default {
    components: { wechatEmotion },
    data() {
      return {
        names
      };
    }
  }
</script>

<style lang="less">
  .wechatEmotionPanel {
    display: flex;
    flex-wrap: wrap;
    .wechatEmotion {
      cursor: pointer;
      margin: 5px;
    }
  }
</style>
