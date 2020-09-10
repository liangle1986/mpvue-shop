<template>
  <div class="categoryList">
    <scroll-view scroll-x="true" :scroll-left="scrollLeft" class="head">
      <div @click="changeTab(index,item)" :class="[nowIndex==index ?'active':'']" v-for="(item, index) in navData"
           :key="index">
        {{item.name}}
      </div>
    </scroll-view>
    <div class="info">
      <p>{{currentNav.name}}</p>
      <p>{{currentNav.frontDesc}}</p>
    </div>
    <div class="list" v-if="goodsList.length!=0">
      <div @click="goodsDetail(item.id)" class="item" v-for="(item, index) in goodsList" :key="index">
        <img :src="item.listPicUrl" alt="">
        <p class="name">{{item.name}}</p>
        <p class="price">￥{{item.retailPrice}}</p>
      </div>
    </div>
    <div v-else class="none">
      数据库暂无数据...
    </div>
  </div>
</template>

<script>
  import {
    get
  } from "../../utils";

  export default {
    created() {
    },
    mounted() {
      //获取页面传的参数
      this.categoryId = this.$root.$mp.query.id;
      this.getAllData();
    },
    data() {
      return {
        categoryId: "",
        nowIndex: 0,
        goodsList: [],
        navData: [],
        currentNav: {},
        scrollLeft: 0,
        page: {
          total: 0,
          size: 10,
          current: 1,
        }
      };
    },
    components: {},
    methods: {
      async changeTab(index, node) {
        this.nowIndex = index;
        this.currentNav = node;
        this.categoryId = node.id;

        this.goodsList = Array();
        this.page.current =1;
        this.goodsListAll();
        //需要让导航滚动到可见区域
        if (this.nowIndex > 4) {
          this.scrollLeft = this.nowIndex * 60;
        }else {
          this.scrollLeft = 0;
        }
      },
      async getAllData() {
        await get("/shop/category/categoryNav", {
          id: this.categoryId
        }).then(d => {
          const ndata = d.data;
          this.navData = ndata.data;
          this.currentNav = ndata.currentNav;
          for (let i = 0; i < this.navData.length; i++) {
            const id = this.navData[i].id;
            if (id == this.currentNav.id) {
              this.nowIndex = i;
              this.categoryId = this.currentNav.id;
            }
          }

          //需要让导航滚动到可见区域
          if (this.nowIndex > 4) {
            this.scrollLeft = this.nowIndex * 60;
          } else {
            this.scrollLeft = 0;
          }

        });
        this.goodsListAll();

      },
      async goodsListAll() {
        await get("/shop/goods/goodsList", Object.assign(this.page, {
          categoryId: this.categoryId
        })).then(d => {
          if(d.data.records != null && d.data.records.length > 0){
            d.data.records.forEach(data=>{
              this.goodsList.push(data);
            })
          }

          this.page.total = d.data.total;
        });
      },
      goodsDetail(id) {
        // console.log(id)
        wx.navigateTo({
          url: "/pages/goods/main?id=" + id
        });
      }
    },
    computed: {},
    // 上拉加载
    onReachBottom: function () {
      this.page.current++;
      this.goodsListAll();
    },
  };

</script>
<style lang='scss' scoped>
  @import "./style";
</style>
