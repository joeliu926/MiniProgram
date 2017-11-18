// pages/pcase/casetrail/casetrail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "trackDesc": [
      {
        "leftTrack": {
          "subject": "",
          "code": "",
          "desc": "",
          "date": 1510891403033
        },
        "rightTrack": {
          "trackDetailList": [
            {
              "subject": "",
              "code": "",
              "desc": "",
              "date": 1510891403033,
              "imgNum": "",
              "imgUrls": []
            },
            {
              "subject": "",
              "code": "",
              "desc": "",
              "date": 1510891403033,
              "imgNum": "",
              "imgUrls": []
            },
            {
              "subject": "",
              "code": "",
              "desc": "",
              "date": 1510891403033,
              "imgNum": 0,
              "imgUrls": [             
              ]
            },
            {
              "subject": "",
              "code": "",
              "desc": "",
              "date": 1510891403033,
              "imgNum": "",
              "imgUrls": []
            },
            {
              "subject": "",
              "code": "",
              "desc": "",
              "date": 1510891403033,
              "imgNum": "",
              "imgUrls": []
            }
          ]
        }
      }
    ],
    "project": {
      "projectIds": [
        "2001",
        "3001"
      ],
      "projectName": ""
    },
    "customer": {
      "headPhotoUrl": "",
      "name": ""
    },
    "consultant": {
      "consultantName": "",
      "consultantLoginName": ""
    },
    "consultationStage": "",

    oUInfo: {},
    oEvent: {
      code: "",
      eventAttrs: {
        appletId: "hldn",
        consultingId: 0,
        consultantId: "",
        triggeredTime: "",
        case: "",
        isLike: "",
        image: {}

      },
      subjectAttrs: {
        appid: "yxy",
        consultantId: "",
        openid: "",
        unionid: "",
        mobile: ""
      }
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options====>",options);
    let _This = this;
    getApp().getUserData(function (uinfo) {
      console.log("uinfo=====>", uinfo);
      _This.setData({
        consultingId: options.consultingId||0,
        oUInfo: uinfo,
        productCode: options.productCode

      });
      _This.fGetConsultationTrail();
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
  fSendCase(){
    var _This=this;
    wx.navigateTo({
      url: '/pages/pcase/pcase?consultationId=' + _This.data.consultingId + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + +_This.data.productCode
    });
  },
  fGetConsultationTrail() {
    wx.showLoading({
      title: 'loading...',
    });
    let _This = this;
    //console.log(_This.data.phonenum);
    wx.request({
      url: "https://27478500.qcloud.la/wxa/consult/trail",
      method: "POST",
      data: {
        unionId: _This.data.oUInfo.unionId || "",
        consultingId: _This.data.consultingId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
        console.log("trail====>", result);
        if (result.data.code == 0) {
          _This.setData({ 
            trackDesc: result.data.data.trackDesc,
            customer: result.data.data.customer,
            consultant: result.data.data.consultant,
            project: result.data.data.project,         
            consultationStage: result.data.data.consultationStage 
            });
        } else {
          console.log(result);
        }
        wx.hideLoading();
      },
      fail:function(){
        wx.hideLoading();
      }
    });
    wx.hideLoading();
  }
})