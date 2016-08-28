<template>
  <router-view v-ref:view :size="name"></router-view>
</template>

<script>
import Douban from './components/Douban'
export default {
  ready () {

  },
  data () {
    return {
      name: 'xiadd'
    }
  },
  components: {
    Douban
  },
  methods: {
    getList () {
      console.log(this.$refs.view.list);
    }
  }
}
</script>
