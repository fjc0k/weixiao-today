import Vue from 'vue';
import iView from 'iview';
import App from './App.vue';

import './styles/today.less';

Vue.use(iView);

new Vue({
  el: '#app',
  render: h => h(App)
});
