<template>
  <div class="collection">
    <div class="title">
      我的收藏
    </div>
    <div class="sublist">
      <div @click="goodsDetail(subitem.id)" v-for="(subitem, subindex) in collectlist" :key="subindex">
        <img :src="subitem.listPicUrl" alt="">
        <p>{{subitem.name}}</p>
        <p>￥{{subitem.retailPrice}}</p>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    get,
    getStorageOpenid
  } from '../../utils';
  export default {
    onShow() {
      this.openId = getStorageOpenid();
      // console.log(this.openId)
      this.getlist();
    },
    created() {},
    mounted() {

    },
    data() {
      return {
        openId: "",
        collectlist: []
      };
    },
    components: {},
    methods: {
      async getlist() {
        const data = await get('/shop/collect/index', {
          userId: this.openId
        })
        this.collectlist = data.data.collectGoodsList;
      },
      goodsDetail(id) {
        wx.navigateTo({
          url: "/pages/goods/main?id=" + id
        });
      },
    },
    computed: {}
  };

</script>
<style lang='scss' scoped>
  @import "./style";

</style>
