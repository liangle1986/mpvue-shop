function formatNumber(n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}

export function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join("/");
  const t2 = [hour, minute, second].map(formatNumber).join(":");

  return `${t1} ${t2}`;
}

//-------------------------------------------------------------------------请求的封装

// const host = "https://www.ywuwu.com";

const host = "http://localhost:9999";

let token = wx.getStorageSync("token_type") + " " + wx.getStorageSync("access_token");
export {host, token};

//请求封装
function request(url, method, data, header = {
  "content-type": "application/json", // 默认值
  "Authorization": token
}) {
  if (!token) {
    header.Authorization = "Basic bXl3dXd1Om15d3V3dQ==";
  }
  wx.showLoading({
    title: "加载中" //数据请求前loading
  });
  return new Promise((resolve, reject) => {
    wx.request({
      url: host + url, //仅为示例，并非真实的接口地址
      method: method,
      data: data,
      header: header,
      success: function (res) {
        wx.hideLoading();
        resolve(res.data.data);
      },
      fail: function (error) {
        wx.hideLoading();
        reject(false);
      },
      complete: function (res) {
        console.log(res);
        const status = res.statusCode || 200;
        if (status === 401) {
          // getOpenid();
          wx.removeStorageSync("userInfo");
          toLogin();
          // wx.navigateTo({
          //   url: "/pages/index/main"
          // });
        }
        wx.hideLoading();
      }
    });
  });
}

export function get(url, data) {
  return request(url, "GET", data);
}

export function post(url, data) {
  return request(url, "POST", data);
}

export function del(url, data) {
  return request(url, "DELETE", data);
}

export function put(url, data) {
  return request(url, "PUT", data);
}

//-------------------------------------------------------------------------请求的封装

//----------------------------------------------用户是否登录 未登录跳转到登录页面 -------------------------

export function toLogin() {
  const userInfo = wx.getStorageSync("userInfo");
  console.log("登陆跳转页面");
  if (!userInfo) {
    wx.navigateTo({
      url: "/pages/login/main"
    });
  } else {
    return userInfo;
  }
}

export function login() {
  const userInfo = wx.getStorageSync("userInfo");
  if (userInfo) {
    return userInfo;
  }
}

//----------------------------------------------用户是否登录 未登录跳转到登录页面 -------------------------

export function getStorageOpenid() {
  const openId = wx.getStorageSync("openId");
  if (openId) {
    return openId;
  } else {
    return "";
  }
}

export function getOpenid() {
  wx.login({
    success: logRes => {
      if (logRes.code) {
        getUserInfo(logRes);

      } else {
        console.log('登录失败！' + res.errMsg)
      }
    },
    fail: () => {

    },
    complete: () => {

    }
  });
}

/**
 * 获取用户信息
 * @param logRes 登陆code
 */
export async function getUserInfo(logRes) {
  wx.getUserInfo({
    success: InfoRes => {

      wx.setStorageSync("nickName", InfoRes.userInfo.nickName);
      wx.setStorageSync("avatarUrl", InfoRes.userInfo.avatarUrl);
      const code = logRes['code'];
      const grant_type = 'mobile';
      const rawData = InfoRes['rawData'];
      const signature = InfoRes['signature'];
      const encryptedData = InfoRes['encryptedData'];
      const iv = InfoRes['iv'];
      const signtype = InfoRes['st'];
      const data = {
        state: "MINI",
        tenantId:1,
        code: code,
        rawData: rawData,
        signature: signature,
        encryptedData: encryptedData,
        iv: iv,
        signtype: signtype
      };

      // const mydata = request(host + '/auth/mobile/token/social','post',{mobile: JSON.stringify(data), grant_type},{
      //    "Content-Type": "application/x-www-form-urlencoded",
      //    'Authorization': "Basic cGlnOnBpZw=="
      //  });
      //  wx.setStorageSync("userInfo", JSON.parse(rawData));
      //  console.log(mydata);
      //  if(mydata){
      //    wx.setStorageSync("access_token", mydata.data.access_token);
      //    wx.setStorageSync("token_type", mydata.data.token_type);
      //    getMyUserInfo();
      //  }

      //发起网络请求
      wx.request(
        {
          url: host + '/auth/mobile/token/social',
          data: {mobile: JSON.stringify(data), grant_type},
          method: "POST",
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': "Basic bXl3dXd1Om15d3V3dQ==",
            'TENANT-ID':1
          },
          success: function (data) {

            wx.setStorageSync("userInfo", JSON.parse(rawData));
            wx.setStorageSync("access_token", data.data.access_token);
            wx.setStorageSync("token_type", data.data.token_type);
            wx.setStorageSync("refresh_token", data.data.refresh_token);
            // getMyUserInfo();
            wx.request(
              {
                url: host + '/admin/user/info',
                method: "get",
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  'Authorization': data.data.token_type + " " + data.data.access_token
                },
                success: function (datas) {
                  console.log(datas.data.data);
                  const openid = datas.data.data.sysUser.wxOpenid;
                  if (openid != null) {
                    wx.setStorageSync("openid", openid);
                  }
                }
              });
            wx.navigateBack({//返回
              delta: 1
            })
          }
        });
    }
  });

}

export async function getMyUserInfo() {
  const data = await get('/admin/user/info');
  console.log(data);

  const openid = data.sysUser.wxOpenid;
  const userInfo = wx.getStorageSync("userInfo");
  console.log(openid);
  if (userInfo != null) {
    // userInfo.openId = openid;
    wx.setStorageSync("openid", openid);
    // wx.setStorageSync("userInfo", userInfo);
  }

  return data;
}
