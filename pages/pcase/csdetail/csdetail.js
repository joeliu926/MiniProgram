// pages/pcase/csdetail/csdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailId:"",
    detailInfo: {
      "doctorName": "刘德华",
      "customerGender": 0,
      "customerLogo": "http://101.132.161.222:8077/mc_files/10088/CASE_LIBRARY/7cb3da9e-f690-4b79-b32c-6a69bdcf629b",
      "customerName": "吴彦祖",
      "customerAge": 12,
      "operationDate": 1510724649000,
      "hospitalName": "协和医院",
      "productName": "你猜",
      "contentList": [
        {
          "title": "",
          "definitionDate": 1510206364000,
          "nodeType": 0,
          "caseFeature": "鼻子太大",
          "description": "",
          "fileList": [
            "http://101.132.161.222:8077/mc_files/10088/null/d6e37de9-1175-41cd-8d15-ffcf82e9ba0f"
          ]
        },
        {
          "title": "术后120天",
          "definitionDate": 1510984011000,
          "nodeType": 1,
          "caseFeature": "这个图片相当好看",
          "description": "",
          "fileList": [
            "http://101.132.161.222:8077/mc_files/10088/null/cc119fdc-302c-4ae3-a4aa-63488ce8a13b"
          ]
        }
      ]

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _This = this;
    var detailId = options.did;
    getApp().getUserData(function (uinfo) {
      _This.setData({
        detailId: detailId
      });
      _This.getCaseDetaul(uinfo);

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
  getCaseDetaul:function(){
    let _This = this;
    wx.request({
      url: "https://27478500.qcloud.la/wxa/case/detail",
      method: "POST",
      data: {
        did: _This.data.detailId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
        if (result.data.code == 0) {
          _This.setData({
            detailInfo: result.data.data
          });
        } else {
          console.log(result);
        }
      }
    });
  }

})