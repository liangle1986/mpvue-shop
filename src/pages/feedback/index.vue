<template>
  <div class="feedback">
    <div class="title">
      意见与反馈
    </div>
    <div class="cont">
      <textarea class="text" max='150' name="" v-model="content" placeholder="请填写你的意见和反馈"></textarea>
      <span>{{content.length}}/150</span>
    </div>
    <div class="connect">
      <label for="">
        联系方式:
      </label>
      <input type="text" v-model="phone" placeholder="邮箱/手机号/微信号">
    </div>
    <div @click="submitMes" class="bottom">
      提交
    </div>
  </div>
</template>

<script>
  import {
    post,
    login,
  } from '../../utils'
  export default {
    mounted() {
      //判断是否登录获取用户信息
      if (login()) {
        this.userInfo = login();
        console.log(this.userInfo);

      }
    },
    data() {
      return {
        userInfo: {},
        content: '',
        phone: ''
      };
    },
    components: {},
    methods: {

      async submitMes() {
        var _this = this;
        if(_this.content == null || _this.content == ''){
          wx.showToast({
            title: '亲，别忘了填写反馈信息哦！', //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
          })
          return
        }
        if(_this.phone == null || _this.phone == ''){
          wx.showToast({
            title: '亲，别忘了填写联系方式哦！', //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
          })
          return
        }
        const data = await post('/shop/feedback', {
          userId: this.userInfo.openId,
          name: this.userInfo.nickName,
          content: this.content,
          mobile: this.phone,
          feedType: 0
      })
        if (data.data) {
          wx.showToast({
            title: '提交成功', //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {
              _this.content = '';
              _this.phone = '';
            }
          });

        }
      },
    },
    computed: {}
  };

</script>
<style lang='scss' scoped>
  @import "./style";

</style>
