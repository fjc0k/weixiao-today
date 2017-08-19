import Vue from 'vue';
import iView from 'iview';
import vueIconfont from 'vue-iconfont';
import App from './App.vue';

import './styles/today.less';
import './styles/iconfont';
import 'vue-iconfont/style/icon.css';

Vue.use(iView);
Vue.use(vueIconfont);

new Vue({
  el: '#app',
  render: h => h(App)
});
