const cmsg = require('../../../public/cmsg.js');
const event = require('../../../public/event.js');
const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detailId:"",
    detailInfo: {
      "doctorName": "",
      "customerGender": 0,
      "customerLogo": "",
      "customerName": "",
      "customerAge": 0,
      "operationDate": 1510724649000,
      "hospitalName": "",
      "productName": "",
      "contentList": [
        {
          "title": "",
          "definitionDate": 1510206364000,
          "nodeType": 0,
          "caseFeature": "",
          "description": "",
          "fileList": [
            ""
          ]
        },
        {
          "title": "",
          "definitionDate": 1510984011000,
          "nodeType": 1,
          "caseFeature": "",
          "description": "",
          "fileList": [
            ""
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
    //_This.fUserEvent(event.eType.caseLike);
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
  imgPreview(e){
    var dataset = e.currentTarget.dataset;
    wx.previewImage({
      current: dataset.src, 
      urls: [dataset.src] 
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  getCaseDetaul:function(){
    let _This = this;


    var pdata = {did: _This.data.detailId};
    wxRequest(wxaapi.pcase.detail.url, pdata).then(function (result) {
      //console.log("000000000000000000000000===>", result);
      if (result.data.code == 0) {
        _This.setData({
          detailInfo: result.data.data
        });
      } else {
        console.log(result);
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
  /**
   * 用户事件
   */
  fUserEvent(eType) {
    let _This = this;
    _This.fGetTempEvent();
    var oData = _This.data.oEvent;
    oData.eventAttrs.triggeredTime = new Date().valueOf();
    oData.code = eType;
    wxRequest(wxaapi.event.add.url, oData).then(function (result) {
      //console.log("000000000000000000000000===>", result);
      if (result.data.code == 0) {
      } else {
        console.log("add  event error---", result);
      }
    });
  }

})