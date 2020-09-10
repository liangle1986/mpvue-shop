<template>
  <div class="branddetail">
    <div class="banner">
      <img v-if="detailData ==null" src="http://yanxuan.nosdn.127.net/1541445967645114dd75f6b0edc4762d.png" alt="">
      <img v-else :src="detailData.listPicUrl" alt="">
      <div class="info">
        <span v-if="detailData== null">MUJI制造商</span>
        <span v-else>{{detailData.name}}</span>
      </div>
    </div>
    <div class="info-desc">
      <p v-if="detailData == null">严选精选了MUJI制造商和生产原料， 用几乎零利润的价格，剔除品牌溢价， 让用户享受原品牌的品质生活。</p>
      <p v-else>{{detailData.simpleDesc}}</p>
    </div>
    <div v-if="goodsList.length!=0" class="sortlist">
      <div v-for="(item, index) in goodsList" :key="index" class="item">
        <img :src="item.listPicUrl" alt="">
        <p class="name">{{item.name}}</p>
        <p class="price">￥{{item.floorPrice}}</p>
      </div>
    </div>
    <div v-else class="none">
      数据库暂无数据...
    </div>
  </div>
</template>

<script>
  import {get} from "../../utils";

  export default {
    created() {
    },
    mounted() {
      this.id = this.$root.$mp.query.id;
      this.getDetail();
    },
    data() {
      return {
        id: "",
        detailData: {},
        goodsList: []
      };
    },
    components: {},
    methods: {
      async getDetail() {
        const data = await get("/shop/brand/detail", {id: this.id});
        this.detailData = data.data.data;
        this.goodsList = data.data.goodsList;
      }
    },
    computed: {}
  };
</script>
<style lang='scss' scoped>
  @import "./style";
</style>
