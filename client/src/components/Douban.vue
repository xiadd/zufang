<template>
  <div>
    <x-header :left-options="{showBack: false}">豆瓣租房</x-header>
    <panel header="豆瓣租房信息" :footer="footer" :list="list" :type="type" @on-click-item="toogleShow" style="margin-top: 0"></panel>
    <popup :show.sync="showPopup" height="100%">
      <div class="popup">
        <h2>{{detailInfo.title}}</h2>
        <p><b>作者:</b><a href="{{detailInfo.originLink}}">{{detailInfo.author}}</a></p>
        <p><b>发布时间:</b>{{detailInfo.pubDate}}</p>
        <p>{{{detailInfo.content}}}</p>
        <x-button type="primary" @click="showPopup = false">返回</x-button>
      </div>
    </popup>
  </div>
</template>

<script>
  import Panel from 'vux/dist/components/panel';
  import Group from 'vux/dist/components/group';
  import Cell from 'vux/dist/components/cell';
  import Radio from 'vux/dist/components/radio';
  import XHeader from 'vux/dist/components/x-header';
  import Popup from 'vux/dist/components/popup';
  import XButton from 'vux/dist/components/x-button';

  export default {
    components: { Panel, Group, Cell, Radio, XHeader, Popup, XButton },
    ready () {
      this.getInfoList();
    },
    data () {
      return {
        type: '2',
        list: [],
        footer: {
          title: '查看更多',
          url: '###'
        },
        showMenus: false,
        showPopup: false,
        detailInfo: {
          title: '',
          originLink: '',
          content: '',
          author: '',
          pubDate: ''
        }
      }
    },
    methods: {
      getInfoList () {
        this.$http.get('/api').then(function (results) {
          this.list = results.data;
        });
      },
      toogleShow (item) {
        this.detailInfo = {
          title: item.title,
          originLink: item.originLink,
          content: item.desc,
          author: item.creator,
          pubDate: item.pubDate
        };
        this.showPopup ? this.showPopup = false : this.showPopup = true;
      }
    }
  }
</script>

<style>
  .popup {
    margin: 15px;
  }
</style>
