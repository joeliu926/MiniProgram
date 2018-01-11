const wxCustomerMsg = require('../../../../public/js/wxCustomerMsg.js');
const event = require('../../../../public/js/wxEvent.js');
const tools = require('../../../../utils/js/util.js');
const wxaapi = require('../../../../public/wxaapi.js');
const wxRequest = require('../../../../utils/js/wxRequest.js');
const wxPromise = require('../../../../utils/js/wxPromise.js');//promise信息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowMask:false,
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
    var _This = this;
    var oEvent = _This.data.oEvent;
    getApp().getUserData(function (uinfo) {
      //console.log(uinfo);
      _This.setData({
        oUserInfo: uinfo,
        cstUid: options.consultantId,
        consultationId: options.consultationId,
        clueId: options.clueId,
        caseId: options.caseId,
        shareEventId: options.shareEventId || "1",
        tel:options.tel,
        cid:options.cid
      });
      //console.log("cstUid----", _This.data.cstUid);
    });

    _This.fGetPhoto();
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
  /**
   * 发送资料给医生
   */
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




    _This.fCustomerOperate();
    _This.fUserEvent(event.eType.informationSubmit);
   // _This.fCustomerMsg();
   /* setTimeout(function () {
      wx.hideLoading();
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      });
      _This.setData({ isUpload: true });
    }, 2000);*/
    wx.hideLoading();
   

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
   // oTempEvent.productCode = _This.data.productCode;
    oTempEvent.clueId = _This.data.clueId; //线索id
    oTempEvent.consultationId = _This.data.consultationId;//咨询会话ID
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
  },
  /**
   * 获取用户上传的图片
   */
  fGetPhoto(){
    let _This = this;
    let postData={
      customerUnionid: _This.data.oUserInfo.unionId,// 客户unionId
      sessionId: _This.data.consultationId//会话id
    };
    wxRequest(wxaapi.consult.getpostphoto.url, postData).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
          frontface: result.data.data.positiveFace,
          sideface: result.data.data.sideFace
        });
      } else {
        console.log("add  event error---", result);
      }
    });
  },
  /**
 * 获取用户操作状态提交资料
 */
  fCustomerOperate() {
    let _This = this;
    let pdata = {
      customerUnionid: _This.data.oUserInfo.unionId,
      consultantUnionid: _This.data.cstUid,//咨询师unionid
      sessionId: _This.data.consultationId,//当前会话id
      caseId: _This.data.caseId, //案例id
      operationType: 2, //1喜欢案例 2提交资料
      positiveFace: _This.data.frontface||"",
      sideFace: _This.data.sideface||""
    };
    console.log("ffffff post data------>", pdata);
    wxRequest(wxaapi.consult.handelsharecase.url, pdata).then(function (result) {
      console.log("ffffff post data result------>",result);
      if (result.data.code == 0) {
        if (!_This.data.tel){
          _This.setData({
            isShowMask: true
          });
        }else{
          _This.setData({ isUpload: true });
          _This.fRedirectBack();
        
        }
      }
    });
  },
  /**
   * 返回前页（分享案例页面）
   */
  fRedirectBack(){
    let _This=this;
    setTimeout(function () {
      let cstUid = _This.data.cstUid;//consultationId
      let consultationId = _This.data.consultationId;
      wx.redirectTo({
        url: '../../ccase/ccase?cstUid=' + cstUid + "&consultationId=" + consultationId
      })

    }, 2000);
  },
  /**
* 授权获取手机号码
*/
  getPhoneNumber(e) {
    let _This = this;
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    if (!encryptedData) {
      return false;
    }
    let sessionKey = "";
    wxPromise(wx.login)().then(result => {
      let ucode = result.code;
      return wxRequest(wxaapi.unionid.code.url, { code: ucode });
    }).then(resSession => {
      sessionKey = resSession.data.session_key;
      return sessionKey;
    }).then(sessionKey => {
      //console.log("sessionKey----->", sessionKey);
      var postData = {
        encryptedData: encryptedData,
        sessionKey: sessionKey, iv: iv
      };
      return wxRequest(wxaapi.unionid.userinfo.url, postData);
    }).then(resAll => {
      let oUserInfo = _This.data.oUserInfo;
      let wxPhone = resAll.data.userinfo.phoneNumber;
      oUserInfo.wechatMobile = wxPhone;
      _This.setData({
        oUserInfo: oUserInfo
      });
      console.log("sessionKey----->", resAll);
      _This.fUpdateCustomerInfo();
    });
  },
  /**
 * 授权后更新客户手机号码
 */
  fUpdateCustomerInfo() {
    let _This = this;
    let oUserInfo = _This.data.oUserInfo;
    console.log("oUserInfo----->", oUserInfo, oUserInfo.id);
    let pdata = {
      id: _This.data.cid,
      wechatMobile: _This.data.oUserInfo.wechatMobile
    };
    wxRequest(wxaapi.customer.update.url, pdata).then(function (result) {
      console.log("update customer result---->", result);
      if (result.data.code == 0) {
        _This.fRedirectBack();
      } else {
        console.log("update customer info error----", result);
      }
    });
  }
})