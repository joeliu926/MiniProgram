
const cmsg = require('../../../public/cmsg.js');
const event = require('../../../public/event.js');
const apiUser= require('../../../utils/APIUinfo.js');
const tools = require('../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photoSide:true,
    frontface:null,
    sideface:null,
    imgKey:1,
    oUserInfo:{},
    isUpload:false,
    shareEventId:"",
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
    var oEvent = _This.data.oEvent;
    getApp().getUserData(function (uinfo) {
      //console.log(uinfo);
      _This.setData({
        oUserInfo:uinfo,
        cstUid: options.consultantId,
        consultationId: options.consultationId,
        shareEventId: options.shareEventId||""
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
  fTakePhoto(){
    var _This=this;
    wx.chooseImage({
      success: function (res) {
        wx.showLoading({
          title: '上传中...',
        });
        var tempFilePaths = res.tempFilePaths
        wx.uploadFile({    
          url: "https://27478500.qcloud.la/uploadimg/attachment/upload",
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'user': 'test'
          },
          success: function (res) {
           // console.log(res);
                  var oData=JSON.parse(res.data);
                  //console.log(oData);
                  if (oData.code==0){
                    var iurl = oData.data[0];
                  if (_This.data.photoSide) {
                    _This.setData({ 
                      frontface: iurl, 
                      imgKey:1
                      });
                  } else {
                    _This.setData({ 
                      sideface: iurl,
                      imgKey:0
                      });
                 }
                  _This.fUserEvent(event.eType.photoUpload);
            }
           // console.log('res', res);
            wx.hideLoading();
          },
          fail:function(res){
              wx.hideLoading();
              console.log(res);
          }
        })
      }
    });

  },
  fChangeSide(e){  
    var _This=this;
    if (!e.target.dataset.choose){
    _This.setData({
      photoSide: !_This.data.photoSide
    });
    }
  },
  fSendMsg(){
    var _This=this;
    if(!_This.data.frontface && !_This.data.sideface){
      wx.showToast({
        title: '请选择图片',
        icon:"loading",
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
      _This.setData({isUpload:true});
    }, 2000);


  },
  fClose(){
    getApp().globalData.flag = true;  
    wx.reLaunch({
      url: '../../home/home',
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
      image:{
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
  fUserEvent(eType) {
    console.log("---post---");
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
        console.log(result);
        if (result.data.code == 0) {
        } else {
          console.log("add  event error---", result);
        }
      }
    });
  },
  fCustomerMsg(){
    var _This=this;
    if (_This.data.oUserInfo.unionId == _This.data.cstUid) {
      return false;
    }
    var oCustom = cmsg.custom;
    oCustom = {
      touser: "oh3NkxCV0gJ0-GtvC7LO5hKBsKio",
      msgtype: "text",
      text: {
        content: "This is a test data" + (new Date().valueOf())
      }
    };
    apiUser.uinfo(_This.data.cstUid, function (result) {
      //console.log("uinfo----", result.data.data.wxOpenId);
      oCustom.touser = result.data.data.wxOpenId;
      oCustom.text.content = "您的客户 " + _This.data.oUserInfo.nickName + " 于" + tools.formatTime() + " 提交了个人资料";
      wx.request({
        url: "https://27478500.qcloud.la/wx/msg/sendmessage",
        method: "POST",
        data: oCustom,
        header: {
          'Content-Type': 'application/json'
        },
        success: function (result) {
          console.log("OK-----", result);
        },
        fail: function (result) {
          console.log("false----", result);
        }
      });

    });
  }
})