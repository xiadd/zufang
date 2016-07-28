<template>
  <divider>华丽分割线</divider>
  <divider><span style="color:green;">华丽分割线</span></divider>
</template>

<script>
  import divider from 'vux/dist/components/divider';

  export default {
    components: { divider },
    ready () {
      console.log(1);
    },
    data () {
      return {

      }
    }
  }
</script>
