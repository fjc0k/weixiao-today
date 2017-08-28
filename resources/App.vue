<template>
  <div class="today">
    <Row :gutter="16">
      <Col span="16">
        <Form ref="configForm" :label-width="80" :model="form.config.model" :rules="form.config.rules">
          <Form-item label="开学日期" prop="startDate">
            <Row>
              <Col span="14">
                <Date-picker
                  v-model="form.config.model.startDate"
                  type="date"
                  format="yyyy年M月d日"
                  placeholder="点击选择开学日期"
                  style="width:100%"
                ></Date-picker>
              </Col>
              <Col span="10" style="padding-left:15px">
                这里的开学日期指校历第一周星期一的日期。
              </Col>
            </Row>
          </Form-item>

          <Form-item label="放假日期" prop="endDate">
            <Row>
              <Col span="14">
                <Date-picker
                  v-model="form.config.model.endDate"
                  type="date"
                  format="yyyy年M月d日"
                  placeholder="点击选择放假日期"
                  style="width:100%"
                ></Date-picker>
              </Col>
              <Col span="10" style="padding-left:15px">
                放假日期可空。
              </Col>
            </Row>
          </Form-item>

          <Form-item label="回复消息" prop="message">
            <Row>
              <Col span="14">
                <Input
                  ref="messageInput"
                  v-model="form.config.model.message"
                  type="textarea"
                  :autosize="{ minRows: 12, maxRows: 12 }"
                  placeholder="输入回复消息"
                ></Input>
              </Col>
              <Col span="10" style="padding-left:15px">
                <macroButtonPanel @chose="insertMacro"></macroButtonPanel>
              </Col>
            </Row>
          </Form-item>
          <Form-item>
            <Button :loading="bool.loading.saveConfig" size="large" long type="primary" @click="saveConfig">
              保存配置
            </Button>
          </Form-item>
        </Form>
      </Col>
      <Col span="8">
        <fakeWechat v-bind="fakeWechat"></fakeWechat>
      </Col>
    </Row>
  </div>
</template>

<script>
  import { getConfig, saveConfig } from './store/fetch';
  import { fakeWechat, macroButtonPanel } from './components';
  import { escapeHtml, insertAtCaret, translateWechatEmotionTextToHtml } from './utils';
  import SchoolCalendar from '../services/SchoolCalendar';

  export default {
    components: {
      fakeWechat,
      macroButtonPanel
    },
    data() {
      return {
        bool: {
          loading: {
            saveConfig: false
          }
        },
        config: {
          keywords: [],
          mediaInfo: {
            mediaName: '',
            avatarImage: ''
          },
          message: ''
        },
        form: {
          config: {
            model: {
              startDate: '',
              endDate: '',
              message: ''
            },
            rules: {
              startDate: [
                { required: true, type: 'date', message: '开学日期不能为空', trigger: 'change' },
                {
                  validator(rule, value, callback) {
                    value.getDay() !== 1 ? callback('开学日期必须为星期一') : callback();
                  },
                  trigger: 'change'
                }
              ],
              message: [
                { required: true, message: '回复消息不能为空', trigger: 'blur' }
              ]
            }
          }
        }
      };
    },
    computed: {
      parsedMessage() {
        const { startDate, endDate, message } = this.form.config.model;

        if (!startDate) return '请先设置<strong>开学日期</strong>。';

        // 时间宏转换
        let parsedMessage = new SchoolCalendar({ startDate, endDate }).parseText(message);

        // 链接转换为 BBcode
        parsedMessage = parsedMessage.replace(
          /<a href="(.+?)">(.+?)<\/a>/g,
          '[url=$1]$2[/url]'
        );

        // 转义 HTML
        parsedMessage = escapeHtml(parsedMessage);

        // 转换表情
        parsedMessage = translateWechatEmotionTextToHtml(parsedMessage);

        // BBcode 转回链接
        parsedMessage = parsedMessage.replace(
          /\[url=(.+?)\](.+?)\[\/url\]/g,
          '<a href="$1">$2</a>'
        );

        return parsedMessage;
      },
      fakeWechat() {
        const {
          keywords,
          mediaInfo: { mediaName, avatarImage },
          message
        } = this.config;
        return {
          config: {
            title: mediaName,
            unreads: 521
          },
          chatSides: {
            me: {
              nickname: '方方方',
              avatar: require('./assets/conan.jpg'),
              position: 'right'
            },
            media: {
              nickname: mediaName,
              avatar: avatarImage,
              position: 'left'
            }
          },
          chatList: [
            {
              from: 'me',
              message: keywords[0]
            },
            {
              from: 'media',
              message: this.parsedMessage
            }
          ]
        };
      }
    },
    methods: {
      insertMacro(macro) {
        const messageEle = this.$refs.messageInput.$refs.textarea;
        insertAtCaret(messageEle, macro);
        this.form.config.model.message = messageEle.value; // 手动同步值
      },
      saveConfig() {
        this.$refs.configForm.validate(async ok => {
          if (!ok) {
            this.$Message.error('配置有误，保存失败！');
          } else {
            this.bool.loading.saveConfig = true;
            await saveConfig(this.form.config.model);
            this.bool.loading.saveConfig = false;
            this.$Message.success('配置保存成功！');
          }
        });
      }
    },
    async mounted() {
      this.config = await getConfig();
      const { startDate, endDate, message } = this.config;
      const { model } = this.form.config;
      model.startDate = startDate && new Date(startDate);
      model.endDate = endDate && new Date(endDate);
      model.message = message;
    }
  };
</script>
