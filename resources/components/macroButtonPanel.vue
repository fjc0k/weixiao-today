<template>
  <div class="macroButtonPanel">

    <divider>在鼠标点击处插入</divider>

    <Row>
      <macroButton icon="link" label="链接" id="linkInput">
        <Form ref="linkForm" :label-width="80" :model="form.link.model" :rules="form.link.rules">
          <Form-item label="链接文字" prop="text">
            <Input v-model.trim="form.link.model.text" placeholder="如：谷歌"></Input>
          </Form-item>
          <Form-item label="链接地址" prop="url">
            <Input v-model.trim="form.link.model.url" placeholder="如：http://www.google.com"></Input>
          </Form-item>
          <Form-item>
            <Row>
              <Button type="primary" @click="insertLink" long :disabled="bool.insertLink">插入</Button>
            </Row>
            <Row>
              <Button type="ghost" @click="$refs.linkForm.resetFields()" long style="margin-top:10px">重置</Button>
            </Row>
          </Form-item>
        </Form>
      </macroButton>
      <macroButton icon="happy-outline" label="微信表情">
        <wechatEmotionPanel @chose="name => sendMacro(`[${name}]`)"></wechatEmotionPanel>
      </macroButton>
    </Row>

    <Row v-for="(macros, index) in macroList" :key="index">
      <template v-for="macro in macros">
        <macroButton v-if="typeof macro === 'string'"
          :label="macro"
          :macro="`[${macro}]`"
          @click="sendMacro"
        ></macroButton>
        <macroButton v-else
          v-bind="macro"
          @click="sendMacro"
        ></macroButton>
      </template>
    </Row>

    <Row>
      <macroButton
        label="打赏开发者10角钱"
        type="default"
        :poptip="{
          position: 'top',
          width: '230'
        }"
      >
        <icon name="hongbao" slot="icon"></icon>
        <img src="../assets/reward-qrcode.jpg" style="width:100%">
      </macroButton>
    </Row>

  </div>
</template>

<script>
  import icon from './icon.vue';
  import divider from './divider.vue';
  import macroButton from './macroButton.vue';
  import wechatEmotionPanel from './wechatEmotionPanel.vue';

  export default {
    components: {
      icon,
      divider,
      macroButton,
      wechatEmotionPanel
    },
    data() {
      return {
        form: {
          link: {
            model: {
              text: '',
              url: ''
            },
            rules: {
              text: [
                { required: true, message: '链接文字不能为空', trigger: 'blur' }
              ],
              url: [
                { required: true, message: '链接地址不能为空', trigger: 'blur' },
                { type: 'url', message: '链接地址不正确', trigger: 'blur' }
              ]
            }
          }
        },
        bool: {
          insertLink: true
        },
        macroList: [
          ['年', '月', '日'],
          ['校历周', '星期'],
          [{ label: '已开学天数', macro: '[已开学天数]', icon: 'android-time' }],
          [{ label: '距放假天数', macro: '[距放假天数]', icon: 'android-time' }]
        ]
      };
    },
    methods: {
      insertLink() {
        const { text, url } = this.form.link.model;
        this.sendMacro(`<a href="${url}">${text}</a>`);
      },
      sendMacro(macro) {
        this.$emit('chose', macro);
      }
    },
    watch: {
      'form.link.model': {
        deep: true,
        handler() {
          this.$refs.linkForm.validate(
            ok => this.bool.insertLink = !ok
          );
        }
      }
    }
  }
</script>

<style lang="less">
  .macroButtonPanel {
    text-align: center;
    .divider {
      padding: 0 0 10px 0;
    }
    .macroButton {
      display: inline-block;
      margin: 0 5px 7px 0!important;
    }
    #linkInput {
      .ivu-form-item {
        margin-bottom: 24px!important;
      }
      .ivu-form-item-content {
        margin-left: 80px!important;
      }
    }
  }
</style>
