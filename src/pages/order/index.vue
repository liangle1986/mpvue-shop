<template>
  <div class="order">
    <div @click="toAddressList" v-if="address" class="address">
      <div class="item">
        <div class="list">
          <div class="addresslist">
            <div>
              <span>{{address.userName}}</span>
              <div v-if="address.isSefault" class="moren">
                默认
              </div>
            </div>
            <div class="info">
              <p>{{address.telNumber}}</p>
              <p>{{address.cityName}}&nbsp;{{address.countyName}}&nbsp;{{address.detailInfo}}</p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
    <div @click="toAdd" v-else class="seladdress">
      请选择收货地址
    </div>
    <div class="orderbox">
      <div class="item">
        <div>商品合计</div>
        <div>￥{{allprice}}</div>
      </div>
      <div class="item">
        <div>运费</div>
        <div v-if="allprice >= 88">免运费</div>
        <div v-else>{{fare}}</div>
      </div>
      <div class="item">
        <div>优惠券</div>
        <div>暂无</div>
      </div>
    </div>
    <div class="cartlist">
      <div class="item" v-for="(item,index) in listData" :key="index">
        <div class="con">
          <div class="left">
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
              x{{item.number}}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      <div>
        实付 : ￥{{allprice}}
      </div>
      <div @click="pay">
        支付
      </div>
    </div>

  </div>
</template>

<script>
  import {
    get,
    post,
    put,
    login,
    getStorageOpenid
  } from "../../utils";
  import wxParse from "mpvue-wxparse";

  export default {
    onShow() {
      if (wx.getStorageSync("addressId")) {
        this.addressId = wx.getStorageSync("addressId");
      }
      this.openId = getStorageOpenid();
    },
    created() {
    },
    mounted() {
      this.goodsId = this.$root.$mp.query.goodsId;
      this.sourceType = this.$root.$mp.query.sourceType;
      this.getDetail();
    },
    data() {
      return {
        addressId: "",
        openId: "",
        allprice: "",
        listData: [],
        address: {},
        fare: 10,
        goodsId:"",
        sourceType: 0
      };
    },
    components: {wxParse},
    methods: {
      pay() {
        // wx.showToast({
        //   title: "支付功能暂未开发", //提示的内容,
        //   icon: "none", //图标,
        //   duration: 1500, //延迟时间,
        //   mask: false, //显示透明蒙层，防止触摸穿透,
        //   success: res => {
        //   }
        // });l
        let that = this;
        wx.login({
          success: logRes => {
            if (logRes.code) {
              let payList = Array();
              this.listData.forEach(g => {
                let payOrder = {
                  userId: this.openId,
                  goodsId: g.goodsId,
                  number: g.number,
                  addressId: this.addressId,
                  allPrice: this.allprice
                }
                payList.push(payOrder);
              })
              //创建本地支付订单
              post("/shop/order/paySaveOrder", payList).then(o => {
                if (o.code == 0) {
                  //添加商品信息/goods
                  post("/pay/goods/wxMini", {
                    goodsId: this.listData[0].goodsId,
                    goodsName: this.listData[0].goodsName,
                    amount: this.allprice,
                    userId: this.openId,
                    status: 0,
                    payOrderId: this.listData[0].id,
                    state: "wxac63c260ffd13439",
                    code: logRes.code,
                    addressId:this.addressId
                  }).then(d => {
                    wx.requestPayment(
                      {
                        'timeStamp': d.data.params.timeStamp,
                        'nonceStr': d.data.params.nonceStr,
                        'package': d.data.params.package,
                        'signType': d.data.params.signType,
                        'paySign': d.data.params.paySign,
                        'success': function (res) {
                          console.log(res);
                          //这里需要跳转页面，更新订单信息
                          that.updateOrder(1, d.data.goods.goodsOrderId);
                        },
                        'fail': function (res) {
                          that.updateOrder(-1, d.data.goods.goodsOrderId);
                        },
                        'complete': function (res) {
                        }
                      })
                  });
                }
              })

            } else {
              console.log('登录失败！' + res.errMsg)
            }
          },
          fail: () => {

          },
          complete: () => {

          }
        });


      },
      async updateOrder(status, orderId) {
        await put("/pay/goods", {
          status: status,
          goodsOrderId: orderId
        });
      },
      toAddressList() {
        wx.navigateTo({
          url: "/pages/addressSelect/main"
        });
      },
      toAdd() {
        wx.navigateTo({
          url: "/pages/addaddress/main"
        });
      },
      async getDetail() {
        const data = await get("/shop/order/listDetail", {
          userId: this.openId,
          addressId: this.addressId,
          goodsId: this.goodsId,
          sourceType: this.sourceType
        });
        if (data.data) {
          this.allprice = data.data.allPrise;
          this.listData = data.data.goodsList;
          this.address = data.data.address;
          this.addressId = data.data.address.id;
          if (this.allprice < 88) {
            this.allprice = parseFloat(this.allprice) + this.fare;
          }
        }
      }
    },
    computed: {}
  };

</script>
<style lang='scss' scoped>
  @import url("~mpvue-wxparse/src/wxParse.css");
  @import "./style";

</style>
