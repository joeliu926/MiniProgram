// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showicon: false,
    phonenum: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // console.log(getApp().globalData.userInfo);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log("---------2222-----------------");
    getApp().getUserData(function(result){
      //console.log(result)
    });
  
    //console.log("+++++++++33333+++++++++++++++++");
   
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

  fInputSearch: function (e) {

    if (e.detail.value.length > 0) {
      this.setData({
        showicon: true,
        phonenum: e.detail.value
      });
    } else {
      this.setData({
        showicon: false,
        phonenum: ""
      });
    }
    console.log(this.data);
  },
  fClearData: function () {
    this.setData({
      showicon: false,
      phonenum: ""
    });
    console.log(this.data);
  },
  fAddNew: function () {
    wx.navigateTo({
      url: '../pcase/pcase',
    })
  }
})