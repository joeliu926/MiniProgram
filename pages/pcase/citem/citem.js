// pages/pcase/cdetail/cdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caseList: [
      {
        "id": 1,
        "doctorName": "刘德华",
        "customerLogo": "http://101.132.161.222:8077/mc_files/10088/CASE_LIBRARY/7cb3da9e-f690-4b79-b32c-6a69bdcf629b",
        "customerName": "吴彦祖",
        "caseName": "我要隆个鼻",
        "productName": "你猜",
        "frondFile": "http://101.132.161.222:8077/mc_files/10088/CASE_LIBRARY/7cb3da9e-f690-4b79-b32c-6a69bdcf629b",
        "backFile": "http://101.132.161.222:8077/mc_files/10088/CASE_LIBRARY/7da37ca3-dde3-4d9a-ab9b-f40c181c4b83"
      }
    ],
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
    console.log(options);
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
  },
  getCaseList(param) {
    let _This = this;
    wx.request({
      url: "https://27478500.qcloud.la/wxa/product/list",
      method: "POST",
      data: {
        unionId: param
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
        if (result.data.code == 0) {
          _This.setData({ projectItems: result.data.data });
        } else {
          console.log(result);
        }
      }
    });
  }
})