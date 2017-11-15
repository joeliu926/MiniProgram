
const cmsg = require('../../../public/cmsg.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoSide:true,
    fronface:null,
    sideface:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  ///ｕｒｌ/wx/msg/sendmessage
    console.log(cmsg.custom);
    var oCustom = cmsg.custom;
    oCustom={
        touser:"oh3NkxCV0gJ0-GtvC7LO5hKBsKio",
        msgtype:"text",
        text:{
           content:"This is a test data"
        }
      };

     ///oh3NkxCV0gJ0-GtvC7LO5hKBsKio
    wx.request({
      url: "https://27478500.qcloud.la/wx/msg/sendmessage",
      method: "POST",
      data: oCustom,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
           console.log(result);
      },
      fail:function(result){
        console.log(result);
      }
    });

    getApp().getUserData(function (uinfo) {
      console.log(uinfo);
    });


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  fTakePhoto(){
    var ids="ids";
    var tType = "1";
    wx.chooseImage({
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);
        wx.uploadFile({
          url: 'https://27478500.qcloud.la/uploadimg/api/customer/uploadPicture/' + ids + '/' + tType, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            var data = res.data

            console.log('res', res);
            //do something
          },
          fail:function(res){
              console.log(res);
          }
        })
      }
    });

  },
  fChangeSide(e){  
    var _This=this;
    if (!e.target.dataset.choose){
    _This.setData({
      photoSide: !_This.data.photoSide
    });
    }
  },
  fSendMsg(){
    wx.showLoading({
      title: '上传中...',
    })


    setTimeout(function () {
      wx.hideLoading();
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
    }, 2000)

    console.log("send ,msg=====");
  }
})