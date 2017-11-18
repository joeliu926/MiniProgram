//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    phoneNum:""
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.navigateBack({
      delta:4 
    });
    wx.navigateBack({
      delta: 1
    });

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  phoneNumInput:function(e){
    this.setData({
      phoneNum: e.detail.value
    })
  },
  sendMsg: function(e) {
    
    let num = this.data.phoneNum;

    this.setData({
      phoneNum: ''
    })
    let regResult = /^1[3|4|5|7|8][0-9]\d{8}$/.test(num);
    if (!regResult){ 
      wx.showModal({
        title: '提示',
        content: '输入的手机号码错误。',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else {
            console.log('用户点击取消')
          }
        }
      })
      return false;
    }

 
    wx.request({
      url: 'https://spro.jxt10690.com/Handler1.ashx?phone=' + num,
      data: {
        x: '',
        y: ''
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        wx.showModal({
          title: '提示',
          content: '发送成功',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else {
              console.log('用户点击取消')
            }
          }
        })
      }
    })
  }
})
