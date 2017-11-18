// pages/pcase/casetrail/casetrail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "trackDesc": [
      {
        "leftTrack": {
          "subject": "姜士虎",
          "code": "appShare",
          "desc": "姜士虎分享了哈罗助手APP",
          "date": 1510891403033
        },
        "rightTrack": {
          "trackDetailList": [
            {
              "subject": "罗兰",
              "code": "appOpen",
              "desc": "罗兰进入了哈罗助手APP",
              "date": 1510891403033,
              "imgNum": "",
              "imgUrls": []
            },
            {
              "subject": "罗兰",
              "code": "caseLike",
              "desc": "罗兰喜欢了案例“提拉注意事项",
              "date": 1510891403033,
              "imgNum": "",
              "imgUrls": []
            },
            {
              "subject": "罗兰",
              "code": "photoUpload",
              "desc": "罗兰上传了照片",
              "date": 1510891403033,
              "imgNum": 2,
              "imgUrls": [
                "../../../public/images/img-demo.png"
              ]
            },
            {
              "subject": "罗兰",
              "code": "informationSubmit",
              "desc": "罗兰提交了资料",
              "date": 1510891403033,
              "imgNum": "",
              "imgUrls": []
            },
            {
              "subject": "罗兰",
              "code": "appQuit",
              "desc": "罗兰退出了哈罗助手APP",
              "date": 1510891403033,
              "imgNum": "",
              "imgUrls": []
            }
          ]
        }
      },
      {
        "leftTrack": {
          "subject": "姜士虎",
          "code": "appShare",
          "desc": "姜士虎分享了哈罗助手APP",
          "date": 1510891403033
        },
        "rightTrack": {
          "trackDetailList": [
            {
              "subject": "罗兰",
              "code": "appOpen",
              "desc": "罗兰进入了哈罗助手APP",
              "date": 1510891403033,
              "imgNum": "",
              "imgUrls": []
            },
            {
              "subject": "罗兰",
              "code": "caseLike",
              "desc": "罗兰喜欢了案例“提拉注意事项",
              "date": 1510891403033,
              "imgNum": "",
              "imgUrls": []
            },
            {
              "subject": "罗兰",
              "code": "photoUpload",
              "desc": "罗兰上传了照片",
              "date": 1510891403033,
              "imgNum": 2,
              "imgUrls": [
                "http://111.com",
                "http://111.com"
              ]
            },
            {
              "subject": "罗兰",
              "code": "informationSubmit",
              "desc": "罗兰提交了资料",
              "date": 1510891403033,
              "imgNum": "",
              "imgUrls": []
            },
            {
              "subject": "罗兰",
              "code": "appQuit",
              "desc": "罗兰退出了哈罗助手APP",
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
      "projectName": "去眼袋 埋线双眼皮 拉皮 提拉 隆胸"
    },
    "customer": {
      "headPhotoUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKuBQaDLQKxR3tMcn2iaF4IOH5L9tYNEOwUAB2IZGqjoEOCtk1sMeeibqI6Ddc87FCnFKesa5cibzMkA/0",
      "name": "罗兰"
    },
    "consultant": {
      "consultantName": "姜士虎",
      "consultantLoginName": "18513855349"
    },
    "consultationStage": "术前",

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
    console.log(options);
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
      url: '../pcase/pcase?consultationId=' + _This.data.consultingId + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + +_This.data.productcode
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
        console.log("trail====>", result.data.data);
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