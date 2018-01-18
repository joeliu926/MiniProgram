// pages/projectcase/post/post.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     postHeight:0,//海报的高度
     selectHeight:128 //选择框高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This=this;
    console.log("------------------",options);

    wx.getSystemInfo({
      success: function (result) {
        console.log("-=-=-=-=-=-=-=-=-",result);
        let postHeight = result.windowHeight - _This.data.selectHeight;
        console.log("postHeight--------->", postHeight);
        _This.setData({
          postHeight: postHeight
        });
      }
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