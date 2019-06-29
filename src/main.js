import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from 'axios';
import VueLazyload from 'vue-lazyload'


Vue.config.productionTip = false;
Vue.prototype.$http = axios;
Vue.use(VueLazyload, {
  loading: require('./assets/default.png')
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");