<template>
  <div class="category">
    <div class="search" @click="tosearch">
      <div class="ser">
        <span class="icon"></span>
        <span>商品搜索,共239款好物</span>
      </div>

    </div>
    <div class="content">
      <scroll-view class="left" scroll-y="true">
        <div class="iconText" @click="selectitem(item.id,index)" v-for="(item, index) in listData"
             :class="[index==nowIndex?'active':'']" :key="index">
          {{item.name}}
        </div>
      </scroll-view>
      <scroll-view class="right" scroll-y="true">
        <div class="banner">
          <img :src="detailData.bannerUrl" alt="">
        </div>
        <div class="title">
          <span>—</span>
          <span>{{detailData.name}}分类</span>
          <span>—</span>
        </div>
        <div class="bottom">
          <div @click="categoryList(item.id)" v-for="(item,index) in detailData.subList" :key="index" class="item">
            <img :src="item.wapBannerUrl" alt="">
            <span>{{item.name}}</span>
          </div>
        </div>
      </scroll-view>
    </div>
  </div>
</template>

<script>
  import {get} from "../../utils";

  export default {
    created() {
    },
    mounted() {
      //获取列表数据
      this.getListData();
      //获取默认右侧数据
      this.selectitem(this.id, this.nowIndex);
    },
    data() {
      return {
        id: "1005000",
        nowIndex: 0,
        listData: [],
        detailData: {}
      };
    },
    components: {},
    methods: {
      tosearch() {
        wx.navigateTo({url: "/pages/search/main"});
      },
      async selectitem(id, index) {
        this.nowIndex = index;
        const data = await get("/shop/category/"+id);
        this.detailData = data.data;
      },
      async getListData() {
        const data = await get("/shop/category/index", {parentId: 0});
        this.listData = data.data;

      },
      categoryList(id) {

        wx.navigateTo({
          url: "../categorylist/main?id=" + id
        });
      }
    },
    computed: {}
  };
</script>
<style lang='scss' scoped>
  @import "./style";
</style>
