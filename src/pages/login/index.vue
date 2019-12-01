<template>
  <div class="login">
    <div class="logo">

    </div>
    <button class="login-btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="showDoLogin">微信登录</button>
  </div>
</template>

<script>
  import {
    host,getOpenid
  } from "../../utils";

  var qcloud = require("wafer2-client-sdk/index.js");
  export default {
    created() {
    },
    mounted() {
      console.log(host);

      // qcloud.setLoginUrl(host + "/auth/mobile/token/social");
      // qcloud.setLoginUrl("https://wwww.ywuwu.com/admin/social/bind");
    },
    data() {
      return {};
    },
    components: {},
    methods: {

      showDoLogin(){

        getOpenid();
      }
      // doLogin() {
      //   wx.showLoading({
      //     title: "登录中...", //提示的内容,
      //     mask: true, //显示透明蒙层，防止触摸穿透,
      //     success: res => {}
      //   });
      //   const session = qcloud.Session.get();
      //   if (session) {
      //     console.log("eeeeee");
      //     // 第二次登录
      //     // 或者本地已经有登录态
      //     // 可使用本函数更新登录态
      //     qcloud.loginWithCode({
      //       success: res => {
      //         // this.setData({ userInfo: res, logged: true });
      //         wx.setStorageSync("key", "value");
      //       },
      //       fail: err => {
      //         console.error(err);
      //       }
      //     });
      //   } else {
      //     // 首次登录
      //     qcloud.login({
      //       success: res => {
      //         console.log(res);
      //         console.log("ssss111");
      //
      //         wx.hideLoading();
      //         wx.setStorageSync("userInfo", res);
      //         var openId = res.openId;
      //         wx.setStorageSync("openId", openId);
      //         wx.navigateBack({});
      //       },
      //       fail: err => {
      //         console.log("ssssw22222");
      //         console.log(err);
      //         wx.hideLoading();
      //         wx.navigateBack({});
      //       }
      //     });
      //   }
      // }
    },
    computed: {}
  };

</script>
<style lang='scss' scoped>
  @import "./style";

</style>
