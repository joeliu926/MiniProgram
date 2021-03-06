const wxCustomerMsg = require('../../../../public/js/wxCustomerMsg.js');
const event = require('../../../../public/js/wxEvent.js');
const tools = require('../../../../utils/js/util.js');
const wxaapi = require('../../../../public/wxaapi.js');
const wxRequest = require('../../../../utils/js/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoSide: true,
    frontface: null,
    sideface: null,
    imgKey: 1,
    oUserInfo: {},
    isUpload: false,
    shareEventId: "",
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
    // console.log("take photos options==>",options);
    var _This = this;
    var oEvent = _This.data.oEvent;
    getApp().getUserData(function (uinfo) {
      //console.log(uinfo);
      _This.setData({
        oUserInfo: uinfo,
        cstUid: options.consultantId,
        consultationId: options.consultationId,
        shareEventId: options.shareEventId || ""
      });
      //console.log("cstUid----", _This.data.cstUid);
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
  fTakePhoto() {
    var _This = this;
    console.log("upload------------------------");
    wx.chooseImage({
      success: function (res) {
        wx.showLoading({
          title: '上传中...',
        });
        var tempFilePaths = res.tempFilePaths
        if (!tempFilePaths) {
          wx.hideLoading();
          return false;
        }
        wx.uploadFile({
          url: wxaapi.img.upload.url,//upload image
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            console.log("----upload-------success------", res);
            var oData = JSON.parse(res.data);
            //console.log(oData);
            if (oData.code == 0) {
              var iurl = oData.data[0];
              if (_This.data.photoSide) {
                _This.setData({
                  frontface: iurl,
                  imgKey: 1
                });
              } else {
                _This.setData({
                  sideface: iurl,
                  imgKey: 0
                });
              }
              _This.fUserEvent(event.eType.photoUpload);
            }
            // console.log('res', res);
            wx.hideLoading();
          },
          fail: function (res) {
            wx.hideLoading();
            console.log("fail---------->", res);
          }
        })
      }
    });

  },
  fChangeSide(e) {
    var _This = this;
    if (!e.target.dataset.choose) {
      _This.setData({
        photoSide: !_This.data.photoSide
      });
    }
  },
  fSendMsg() {
    var _This = this;
    if (!_This.data.frontface && !_This.data.sideface) {
      wx.showToast({
        title: '请选择图片',
        icon: "loading",
        duration: 1000
      });
      return false;
    }
    wx.showLoading({
      title: '上传中...',
    })
    _This.fUserEvent(event.eType.informationSubmit);
    _This.fCustomerMsg();
    setTimeout(function () {
      wx.hideLoading();
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      });
      _This.setData({ isUpload: true });
    }, 2000);


  },
  fClose() {
    this.fUserEvent(event.eType.appQuit);//退出页面
    getApp().globalData.flag = true;
    wx.reLaunch({
      url: '../../../home/home',
    })
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
      caseId: _This.data.likeItem,
      image: {
        imgKey: _This.data.imgKey,
        frontface: _This.data.frontface,
        sideface: _This.data.sideface
      }
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
      // console.log("000000000000000000000000===>", result);
      //console.log("photo--Event---" + eType + "---", result);
      if (result.data.code == 0) {
      } else {
        console.log("add  event error---", result);
      }
    });
  },
  /**
   * 发送客服消息
   */
  fCustomerMsg() {
    var _This = this;
    if (_This.data.oUserInfo.unionId == _This.data.cstUid) {//自己查看不返回事件通知
      return false;
    }
    var sendMsg = "您的客户 " + _This.data.oUserInfo.nickName + " 于" + tools.formatTime() + " 提交了个人资料";
    wxCustomerMsg.fSendWxMsg(_This.data.cstUid, sendMsg);
  }
})