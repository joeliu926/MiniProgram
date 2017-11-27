// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ballBottom: 240,
    ballRight: 120,
    screenHeight: 0,
    screenWidth: 0,
    imgData:[0,0,0,0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
  },

  ballMoveEvent: function (e) {
    console.log('我被拖动了....')
    var touchs = e.touches[0];
    var pageX = touchs.pageX;
    var pageY = touchs.pageY;
    console.log('pageX: ' + pageX)
    console.log('pageY: ' + pageY)
    if (pageX < 30) return;
    if (pageX > this.data.screenWidth - 30) return;
    if (this.data.screenHeight - pageY <= 30) return;
    if (pageY <= 30) return;
    var x = this.data.screenWidth - pageX - 30;
    var y = this.data.screenHeight - pageY - 30;
    console.log('x: ' + x)
    console.log('y: ' + y)
    this.setData({
      ballBottom: y,
      ballRight: x
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
  
  }
})