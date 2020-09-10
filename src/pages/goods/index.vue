<template>
  <div class="goods">
    <div class="swiper">
      <swiper class="swiper-container" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
        <block v-for="(item, index) in gallery " :key="index">
          <swiper-item class="swiper-item">
            <image :src="item.imgUrl" class="slide-image"/>
          </swiper-item>
        </block>
      </swiper>
      <button class="share" hover-class="none" open-type="share" value="">分享商品</button>
    </div>
    <div class="swiper-b">
      <div class="item">30天无忧退货</div>
      <div class="item">48小时快速退款</div>
      <div class="item">满88元免邮费</div>
    </div>
    <div class="goods-info">
      <div class="c">
        <p>{{info.name}}</p>
        <p>{{info.goodsBrief}}</p>
        <p>￥{{info.retailPrice}}</p>
        <div v-if="brand" class="brand">
          <p>{{brand.name}}</p>
        </div>
      </div>
    </div>
    <div @click="showType" class="section-nav">
      <div>请选择规格数量</div>
      <div></div>
    </div>
    <div class="sortnav">
      <div @click="changeTab(0)" :class="[0==nowIndex ?'active':'']">参数</div>
      <div @click="changeTab(2)" :class="[2==nowIndex ?'active':'']">评论</div>
      <div @click="changeTab(1)" :class="[1==nowIndex ?'active':'']">详情
      </div>
    </div>
    <!--<div @click="showType" class="section-nav">-->
      <!--<div>用户评价</div>-->
      <!--<div></div>-->
    <!--</div>-->

    <div id="0view" v-show="showView.view0" class="attribute">
      <div class="head">
        商品参数
      </div>
      <div v-for="(item,index) in attribute" :key="index" class="item">
        <div>{{item.name}}</div>
        <div>{{item.value}}</div>
      </div>
    </div>
    <div id="2view" v-show="showView.view2" class="ment">
      <div class="head">
        评论&nbsp;&nbsp;共{{mentCount}}条
      </div>
      <div v-for="(item,index) in comment" :key="index" class="content">
        <div>{{item.user.nickname}}</div>
        <div>{{item.content}}</div>
        <div>{{item.addTime}}</div>
      </div>

      <div class="button">
        <button @click="showComment">全部评价</button>
      </div>
    </div>
    <div id="1view" v-show="showView.view1" v-if="goods_desc" class="detail">
      <wxParse :content="goods_desc"/>
    </div>
    <!-- 常见问题 -->
    <div class="common-problem">
      <div class="h">
        <div class="line"></div>
        <text class="title">常见问题</text>
        <div class="line"></div>
      </div>
      <div class="b">
        <div class="item" v-for="(item, index) in issueList" :key="index">
          <div class="question-box">
            <text class="spot"></text>
            <text class="question">{{item.question}}</text>
          </div>
          <div class="answer">
            {{item.answer}}
          </div>
        </div>
      </div>
    </div>
    <!-- 常见问题 -->
    <!-- 大家都在看 -->

    <div class="common-problem">
      <div class="h">
        <div class="line"></div>
        <text class="title">大家都在看</text>
        <div class="line"></div>
      </div>
      <div class="sublist">
        <div @click="togoodsDetail(subitem.id)" v-for="(subitem, subindex) in productList" :key="subindex">
          <img :src="subitem.listPicUrl" alt="">
          <p>{{subitem.name}}</p>
          <p>￥{{subitem.retailPrice}}</p>
        </div>
      </div>
    </div>

    <!-- 大家都在看 -->
    <div class="bottom-fixed">
      <div @click="collect">
        <div class="collect" :class="[collectFlag ? 'active' :'']">

        </div>

      </div>
      <div @click="toCart">
        <div class="car">
          <span>
            {{allnumber}}
          </span>
          <img src="/static/images/ic_menu_shoping_nor.png" alt="">
        </div>
      </div>
      <div @click="bug">立即购买</div>
      <div @click="addCart">加入购物车</div>
    </div>

    <!-- 选择规格部分 -->
    <div v-show="showpop" @click="showType" class="pop">

    </div>
    <div class="attr-pop" :class="[showpop ? 'fadeup' : 'fadedown']">
      <div class="top">
        <div class="left">
          <img :src="info.primaryPicUrl" alt="">
        </div>
        <div class="right">
          <div>
            <p>价格￥{{info.retailPrice}}</p>
            <p>请选择数量</p>
          </div>
        </div>
        <div @click="showType" class="close">
          X
        </div>
      </div>
      <div class="spec">

        <div v-if="spec" class="specData" v-for="(value, ind) in spec" :key="ind">
          <p>{{value.name}}</p>
          <div class="valueData">
            <!--<p v-for="item in value" :key="item.id">-->
            <div v-for="(item, index) in value.children" :key="index" class="icon" @click="changeColor(ind, item)"
                 :class="[ Listids[ind] === item.id ? 'active' : '',{active:ischeck}]">{{item.value}}
            </div>
            <!--{{item.value}}-->
            <!--</p>-->

          </div>
        </div>
        <div class="b">
          <p>数量</p>
          <div class="count">
            <div @click="reduce" class="cut">-</div>
            <input class="number" disabled="" v-model="number"/>
            <div @click="add" class="add">+</div>
          </div>
        </div>
      </div>


    </div>
    <!-- 选择规格部分 -->
  </div>
</template>

<script>
  import {get, post, toLogin, login, getStorageOpenid} from "../../utils";
  import wxParse from "mpvue-wxparse";

  export default {
    onShow() {
      this.openId = getStorageOpenid();
    },
    mounted() {
      //判断是否登录获取用户信息
      if (login()) {
        this.userInfo = login();
      }

      this.goodsId = this.$root.$mp.query.id;


      this.goodsDetail();
    },
    //商品转发
    onShareAppMessage() {

      return {
        title: this.info.name,
        path: "/pages/goods/main?id=" + this.info.id,
        imageUrl: this.gallery[0].imgUrl //拿第一张商品的图片
      };
    },
    data() {
      return {
        allnumber: 0,
        openId: "",
        collectFlag: false,
        number: 1,
        showpop: false,
        gallery: [],
        info: {},
        brand: {},
        attribute: [],
        comment: [],
        mentCount: 0,
        issueList: [],
        productList: [],
        goods_desc: "",
        userInfo: "",
        goodsId: "",
        allPrice: "",
        spec: [],
        ischeck: false,
        Listids: [],
        tospecIndex: 1,
        nowIndex: 0,
        showView:{
          view0:true,
          view1:true,
          view2:true,
        },
      };
    },
    components: {
      wxParse
    },
    methods: {
      togoodsDetail(id) {
        wx.redirectTo({url: "/pages/goods/main?id=" + id});
      },
      add() {
        this.number = this.number + 1;
      },
      reduce() {
        if (this.number > 1) {
          this.number = this.number - 1;
        } else {
          return false;
        }
      },
      async bug() {
        // if (toLogin()) {
        if (this.showpop) {
          if (this.number == 0) {
            wx.showToast({
              title: "请选择商品数量", //提示的内容,
              duration: 2000, //延迟时间,
              icon: "none",
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {
              }
            });
            return false;
          }
          // const data = await post("/shop/order/submit", {
          //   goodsId: this.goodsId,
          //   userId: this.openId,
          //   allPrice: this.allPrice + ""
          // });
          // if (data) {
            wx.navigateTo({
              url: "/pages/order/main?goodsId="+this.goodsId + "&sourceType=0"
            });
          // }
        } else {
          this.showpop = true;
        }
        // }
      },
      async collect() {
        if (toLogin()) {
          this.collectFlag = !this.collectFlag;
          await post("/shop/collect/addordelete", {
            userId: this.openId,
            valueId: this.goodsId
          });
        }
      },
      async addCart() {
        if (toLogin()) {
          if (this.showpop) {
            if (this.number == 0) {
              wx.showToast({
                title: "请选择商品数量", //提示的内容,
                duration: 2000, //延迟时间,
                icon: "none",
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {
                }
              });
              return false;
            }
            const data = await post("/shop/cart/add", {
              userId: this.openId,
              goodsId: this.goodsId,
              number: this.number
            }).then(d => {
              var msg = "添加购物车成功";
              if (d.code === 1) {
                this.msg = d.msg;
              }
              this.allnumber = this.allnumber + this.number;
              wx.showToast({
                title: this.msg,
                icon: "success",
                duration: 1500
              });
            });
          } else {
            this.showpop = true;
          }
        }
      },
      toCart() {
        wx.switchTab({
          url: "/pages/cart/main"
        });
        // wx.navigateTo({
        //   url: "/pages/cart/main"
        // });
      },
      async goodsDetail() {
        await get("/shop/goods/detail", {
          id: this.goodsId,
          openId: this.openId
        }).then(g => {
          const data = g.data;
          this.gallery = data.gallery;
          this.info = data.info;
          this.allPrice = data.info.retailPrice;
          this.goodsId = data.info.id;
          this.brand = data.brand;
          this.attribute = data.attribute;
          this.goods_desc = data.info.goodsDesc;
          this.issueList = data.issue;
          this.collectFlag = data.collected;
          this.allnumber = data.allnumber;
          this.productList = data.productList;
          this.spec = data.spec;
          this.comment = data.comment.records;
          this.mentCount = data.comment.total;
        });
      },
      showType() {
        this.showpop = !this.showpop;
      },
      changeColor(index, item) {
        if (this.Listids[index]) {
          // this.$set(this.Listids, index, false);
          this.$set(this.Listids, index, item.id);
        } else {
          this.$set(this.Listids, index, item.id);
        }
        if(item.picUrl){
          this.info.primaryPicUrl = item.picUrl;
        }

      },
      changeTab(index) {
        this.nowIndex = index;
        if(index==1){
          this.showView.view0 = false;
          this.showView.view2 = true;
          this.showView.view2 = false;

        } else if(index ==2){
          this.showView.view0 = false;
          this.showView.view1 = false;
          this.showView.view2 = true;
        } else {
          this.showView.view0 = true;
          this.showView.view1 = true;
          this.showView.view2 = true;
        }
        // const query = wx.createSelectorQuery();
        // query.select("#"+ index + "view").boundingClientRect();
        // query.selectViewport().scrollOffset();
        // query.exec(function(res){
        //   console.log(res);
        //  let miss = res[1].scrollTop + 0 - 10;
        //   wx.pageScrollTo({scrollTop : miss, duration: 300})
        // })
      },
      showComment(){
        wx.navigateTo({
          url: "/pages/comment/main?goodsId="+this.goodsId
        });
      },
    },
    computed: {}
  };
</script>
<style lang='scss' scoped>
  @import url("~mpvue-wxparse/src/wxParse.css");
  @import "./style.scss";
</style>
