const cmsg = require('../../../public/cmsg.js');
const event = require('../../../public/event.js');
const apiUser = require('../../../utils/APIUinfo.js');
const tools = require('../../../utils/util.js');
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
    },

    oUserInfo: {},
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
    var _This = this;
    var detailId = options.did;
    getApp().getUserData(function (uinfo) {
      _This.setData({
        detailId: detailId,
        oUserInfo: uinfo,
        cstUid: options.cstUid,
        consultationId: options.consultationId,
        shareEventId: options.shareEventId||""
      });
      _This.getCaseDetaul(uinfo);

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _This =this;
   // _This.fUserEvent(event.eType.caseLike);
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
  },
  /*
*事件参数 
*/
  fGetTempEvent() {
    var _This = this;
    var oTempEvent = _This.data.oEvent;
    oTempEvent.shareEventId = _This.data.shareEventId;
    oTempEvent.eventAttrs = {
      appletId: "hldn",
      consultingId: _This.data.consultationId,
      consultantId: _This.data.cstUid,
      isLike: _This.data.isLike,
      caseId: _This.data.detailId
    }
    oTempEvent.subjectAttrs = {
      appid: "yxy",
      openid: _This.data.oUserInfo.openId,
      unionid: _This.data.oUserInfo.unionId,
      consultantId: _This.data.cstUid,
      mobile: ""
    };
    _This.setData({
      oEvent: oTempEvent
    });
  },
  fUserEvent(eType) {
    let _This = this;
    _This.fGetTempEvent();
    var oData = _This.data.oEvent;
    oData.eventAttrs.triggeredTime = new Date().valueOf();
    oData.code = eType;
    wx.request({
      url: "https://27478500.qcloud.la/wxa/event/add",
      method: "POST",
      data: oData,
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
       // console.log(result);
        if (result.data.code == 0) {
        } else {
          console.log("add  event error---", result);
        }
      }
    });
  }

})