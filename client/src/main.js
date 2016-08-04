import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

//引入视图
import Douban from './components/Douban.vue';

Vue.use(VueRouter);
Vue.use(VueResource);

var router = new VueRouter();

router.map({
  '/demo': {
    component: Douban
  }
});

/* eslint-disable no-new */

router.start(App, 'app');
