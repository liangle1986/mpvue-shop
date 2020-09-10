<template>
  <div class="cart">
    <div class="top">
      <div>30天无忧退货</div>
      <div>48小时快速退款</div>
      <div>满88元免邮费</div>
    </div>
    <div class="cartlist">
      <!--  -->
      <div class="item" @touchstart="startMove" @touchmove="deleteGoods" @touchend="endMove" :data-index="index"
           v-for="(item,index) in listData"
           :key="index">
        <div class="con" :style="item.textStyle">
          <div class="left">
            <div class="icon" @click="changeColor(index,item.goodsId)"
                 :class="[ Listids[index] ? 'active' : '',{active:allcheck}]"></div>
            <div class="img">
              <img :src="item.listPicUrl" alt="">
            </div>
            <div class="info">
              <p>{{item.goodsName}}</p>
              <p>￥{{item.retailPrice}}</p>
            </div>
          </div>
          <div class="right">
            <div class="num">
              <div class="count">
                <div @click="reduce(item.number, item.goodsId)" class="cut">-</div>
                <input class="number" disabled="" v-model="item.number" />
                <div @click="add(item.number, item.goodsId)" class="add">+</div>
              </div>
              <!--{{item.number}}-->
            </div>
          </div>
        </div>

        <div @click="delGoods(item.id,index)" class="delete" :style="item.textStyle1">
          <div>
            删除
          </div>
        </div>

      </div>
    </div>
    <div v-if="false" class="nogoods">
      <img src="http://nos.netease.com/mailpub/hxm/yanxuan-wap/p/20150730/style/img/icon-normal/noCart-a8fe3f12e5.png"
           alt="">
    </div>
    <div class="fixed">
      <div @click="allCheck" :class="{active:allcheck}" class="left">
        全选({{isCheckedNumber}})
      </div>
      <div class="right">
        <div>
          ￥{{allPrise}}
        </div>
        <div @click="orderDown">下单</div>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    get,
    post,
    del,
    login,
    put,
    getStorageOpenid
  } from "../../utils";

  export default {
    onShow() {
      this.userInfo = login();
      this.openId = this.userInfo.openId;
      this.getListData();
    },
    created() {
    },
    data() {
      return {
        openId: "",
        allcheck: false,
        listData: [],
        Listids: [],
        userInfo: {},
        tranX: 0,
        tranX1: 0,
        startX: "",
        startY: "",
        moveX: "",
        moveY: "",
        moveEndX: "",
        moveEndY: "",
        X: 0,
        Y: ""
      };
    },
    components: {},
    methods: {
      initTextStyle() {
        //滑动之前先初始化数据
        for (var i = 0; i < this.listData.length; i++) {
          this.listData[i].textStyle = "";
          this.listData[i].textStyle1 = "";
        }
      },
      startMove(e) {
        this.initTextStyle();
        this.startX = e.touches[0].pageX;
        this.startY = e.touches[0].pageY;
      },
      deleteGoods(e) {
        //滑动之前先初始化样式数据
        this.initTextStyle();
        var index = e.currentTarget.dataset.index;
        console.log(index);
        if (this.X <= -100) {
          this.flag = true;
        }
        if (!this.flag) {
          this.moveX = e.touches[0].pageX;
          this.moveY = e.touches[0].pageY;
          this.X = this.moveX - this.startX;
          this.Y = this.moveX - this.startY;
          this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
          if (this.X >= 100) {
            this.X = 0;
          }
          this.tranX = this.X;
          if (this.X <= -100) {
            this.X = -100;
          }
          this.tranX1 = this.X;
          this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
        } else {
          this.moveX = e.touches[0].pageX;
          this.moveY = e.touches[0].pageY;
          this.X = this.moveX - this.startX;
          this.Y = this.moveX - this.startY;

          this.tranX = this.X - 100;
          this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
          // transform:'translateX(' + tranX + 'rpx)'
          console.log("heyushuo");

          console.log(this.listData[index].textStyle);

          if (this.X + -100 > -100) {
            this.flag = false;
          }
          this.tranX1 = -100;
          this.listData[index].textStyle1 = `transform:translateX(-100rpx);`;
          console.log(this.listData[index].textStyle1);
          // this.listData = this.listData;
        }
        // if (Math.abs(this.X) > Math.abs(this.Y) && this.X > 20) {
        //   this.scrollflag = false;
        // } else if (Math.abs(this.X) > Math.abs(this.Y) && this.X < 20) {
        //   console.log("right 2 left");
        // }
      },
      endMove(e) {
        var index = e.currentTarget.dataset.index;
        if (this.X > -50) {
          this.tranX1 = 0;
          this.tranX = 0;
          this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
          this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
        } else if (this.X <= -50) {
          this.tranX1 = -100;
          this.tranX = -100;
          this.listData[index].textStyle = `transform:translateX(${this.tranX}rpx);`;
          this.listData[index].textStyle1 = `transform:translateX(${this.tranX1}rpx);`;
        }
      },
      async orderDown() {
        if (this.Listids.length == 0) {
          wx.showToast({
            title: "请选择商品",
            icon: "none",
            duration: 1500
          });
          return false;
        }
        // 去掉数组中空的false的
        var newgoodsid = [];
        for (let i = 0; i < this.Listids.length; i++) {
          const element = this.Listids[i];
          if (element) {
            newgoodsid.push(element);
          }
        }
        var goodsId = newgoodsid.join(",");
        // await post("/shop/order/submit", {
        //   goodsId: goodsId,
        //   userId: this.openId,
        //   allPrice: this.allPrise
        // }).then(d=>{
        //   if(d.code === 0){
        //   }
        // });
        wx.navigateTo({
          url: "/pages/order/main?goodsId="+ goodsId + "&sourceType=1"
        });
      },
      async delGoods(id, index) {
        var _this = this;
        wx.showModal({
          title: "",
          content: "是否要删除该商品",
          success: function (res) {
            if (res.confirm) {

              _this.Listids.splice(index, 1);
              const data = del("/shop/cart/"+id).then(() => {
                _this.getListData();
              });
            } else if (res.cancel) {
              console.log("用户点击取消");
              //滑动之前先初始化样式数据
              _this.initTextStyle();
            }
          }
        });
      },
      async getListData() {
        await get("/shop/cart/cartList", {
          openId: this.openId
        }).then(d=>{
          const data= d;
          for (var i = 0; i < data.data.length; i++) {
            data.data[i].textStyle = "";
            data.data[i].textStyle1 = "";
          }
          this.listData = data.data;
        });
      },
      allCheck() {
        //先清空
        this.Listids = [];
        if (this.allcheck) {
          this.allcheck = false;
        } else {
          this.allcheck = true;
          //循环遍历所有的商品id
          for (let i = 0; i < this.listData.length; i++) {
            const element = this.listData[i];
            this.Listids.push(element.goodsId);
          }
        }
      },
      change(e) {
      },
      changeColor(index, id) {
        if (this.Listids[index]) {
          this.$set(this.Listids, index, false);
        } else {
          this.$set(this.Listids, index, id);
        }
      },
      // 数量添加
      add(number, goodsId) {
        this.listData.forEach(d=>{
          if(d.goodsId == goodsId) {
            d.number = number + 1;
            this.updateCartNumber(d.id, d.number);
            return;
          }
        })
      },
      //移除数量
      reduce(number, goodsId) {
        if (number > 1) {
          this.listData.forEach(d=>{
            if(d.goodsId == goodsId) {
              d.number = number - 1;
              this.updateCartNumber(d.id, d.number);
              return;
            }
          })
        } else {
          return false;
        }
      },
      updateCartNumber(id, number){
         put("/shop/cart", {
          id: id,
          number: number
        })
      }
    },
    computed: {
      isCheckedNumber() {
        let number = 0;
        for (let i = 0; i < this.Listids.length; i++) {
          if (this.Listids[i]) {
            number++;
          }
        }
        if (number == this.listData.length && number != 0) {
          this.allcheck = true;
        } else {
          this.allcheck = false;
        }
        return number;
      },
      allPrise() {
        var Prise = 0;
        for (let i = 0; i < this.Listids.length; i++) {
          if (this.Listids[i]) {
            Prise = Prise + this.listData[i].retailPrice * this.listData[i].number;
          }
        }
        return Prise;
      }
    }
  };

</script>
<style lang='scss' scoped>
  @import "./style";

</style>
