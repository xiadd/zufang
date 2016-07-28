import Vue from 'vue'
import App from './App'
import VueRouter from 'vue-router'
import 'vux/dist/vux.css'

Vue.use(VueRouter);

var router = new VueRouter();

router.map({
  '/demo': {
    component: {}
  }
});

/* eslint-disable no-new */

router.start(App, 'app');
