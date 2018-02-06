// pages/client/cmassgift/giftsuccess/giftsuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This=this;
    _This.setData({
      unionId: options.unionId
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
  /**
   * 返回前页
   */
  fGoBack(){
    wx.navigateBack({
      delta: 1
    });
  },
  /**
   * 查看诊所地图
   */
  fGoToMap(){
   console.log("go to map");
   wx.navigateTo({
     url: '/pages/client/ccase/clinicmap/clinicmap?unionId=' + this.data.unionId,
   })
  }
})