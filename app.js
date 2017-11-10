//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
     wx.login({
       success: function (res) {
         if (res.code) {
         }
       }
     });
     this.getUserData();
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                console.log("----this.userInfoReadyCallback------");
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
   userInfo: null
  },
 getUserData:function(callback){
   console.log(!this.globalData.userInfo);
   if (this.globalData.userInfo&&this.globalData.userInfo.unionId){
     console.log("------------exist--------");
     if (callback) {
       callback(resAll.data.userinfo);
     }
     return false;
   }
   console.log("-=-=-=-=-=-=-=-=-=-=-");
   wx.login({
     success: function (res) {
       if (res.code) {
         wx.request({
           url: "https://27478500.qcloud.la/wxa/unionid/code",
           method: "POST",
           data: {
             code: res.code
           },
           header: {
             'Content-Type': 'application/json'
           },
           success: function (resSession) {
             var sessionKey = resSession.data.session_key;
             wx.getUserInfo({
               success: function (res) {
                 var encryptedData = res.encryptedData;
                 var iv = res.iv;
                 wx.request({
                   url: "https://27478500.qcloud.la/wxa/unionid/userinfo",
                   method: "POST",
                   data: {
                     encryptedData: encryptedData,
                     sessionKey: sessionKey,
                     iv: iv
                   },
                   header: {
                     'Content-Type': 'application/json'
                   },
                   success: function (resAll) {
                     //console.log(resAll);
                     getApp().globalData.userInfo = resAll.data.userinfo;
                     //return resAll.data.userinfo;
                     if (callback){
                       callback(resAll.data.userinfo);
                     }
                   }
                 });
               }
             });

           },
           error: function (res) {
             console.log(res);
           }
         });
       }
     }
   });
 }
})