// pages/pcase/cdetail/cdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    isConsult: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var test = options.test;
    if (test) {
      this.setData({
        isConsult: false
      });
    }
    getApp().getUserData(function(uinfo){
        //console.log("----------------============");
       // console.log(uinfo);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /* wx.setNavigationBarTitle({
       title:"This is a title"
     })*/
     //console.log("-----------+++++++++---------");
     //console.log(getApp().globalData.userInfo)
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
    console.log("ffff");
    return {
      title: '自定义分享标题',
      path: '/pages/pcase/citem/citem?test=123'
    }
  },
  fCaseDetail: function (item) {
    console.log(item.target.dataset.uid);
    wx.navigateTo({
      url: '../csdetail/csdetail',
    })
  },
  fLikeCase: function () {
    wx.navigateTo({
      url: '/pages/pcase/tkphoto/tkphoto',
    })
  },
  fUnlikeCase: function () {

  },
  fShareMessage: function () {
    console.log("show share");
 
    wx.showShareMenu({
      withShareTicket: true
    });
  }
})