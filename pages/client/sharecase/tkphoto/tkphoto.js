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
    isErrorUpload:false,//授权手机号码失败
    imageList:[],//上传图片集合
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
 * 生命周期函数--监听页面隐藏
 */
  onHide: function () {
    //this.fUserEvent(event.eType.appQuit);//授退出事件
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //this.fUserEvent(event.eType.appQuit);//授退出事件
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  fTakePhoto() {
    var _This = this;
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
            var oData = JSON.parse(res.data);
            //console.log(oData);
            if (oData.code == 0) {
              var iurl = oData.data[0];
              let imageList = [iurl]; //需要上传的图片集合
              //imageList.push(iurl);
              if (_This.data.photoSide) {
                _This.setData({
                  frontface: iurl,
                  imgKey: 1,
                  imageList: imageList
                });
              } else {
                _This.setData({
                  sideface: iurl,
                  imageList: imageList,
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
        title: '请选择照片',
        icon: "loading",
        duration: 1000
      });
      return false;
    }

    let imageList = _This.data.imageList||[]; //需要上传的图片集合
    _This.data.frontface && imageList.push(_This.data.frontface);
    _This.data.sideface && imageList.push(_This.data.sideface);
    _This.setData({
      imageList: imageList
    });

    wx.showLoading({
      title: '上传中...',
    })
    _This.fCustomerOperate();
    _This.fUserEvent(event.eType.informationSubmit);
    wx.hideLoading();
  },
  fClose() {
    this.fUserEvent(event.eType.appQuit);//退出页面
    getApp().globalData.flag = true;
    wx.reLaunch({
      url: '/pages/index/home',
    })
  },
  /*
 *事件参数 
 */
  fGetTempEvent() {
    var _This = this;
    var oTempEvent = _This.data.oEvent;
    oTempEvent.shareEventId = _This.data.shareEventId;
    oTempEvent.productCode = [""];
    oTempEvent.clueId = _This.data.clueId; //线索id
    oTempEvent.consultationId = _This.data.consultationId;//咨询会话ID
    oTempEvent.leadsId = _This.data.clueId; //线索id新  leadsId
    oTempEvent.sceneId = _This.data.consultationId;// 场景sceneId  oUserInfo.
    let imageList = _This.data.imageList;
    oTempEvent.eventAttrs = {
      clueId: _This.data.clueId, //线索id  
      leadsId: _This.data.clueId, //线索id新  leadsId
      consultationId: _This.data.consultationId,//咨询会话ID
      sceneId: _This.data.consultationId,// 场景sceneId  oUserInfo.
      appletId: "hldn",
      consultingId: _This.data.consultationId,
      consultantId: _This.data.cstUid,
      isLike: _This.data.isLike||"",
      caseId: _This.data.caseId,//
      reserveId: "",//
      agree: _This.data.agree, //1是允许，0是拒绝
      remark: '',
      imgNum: imageList.length,
      imgUrls: imageList,
      triggeredTime: new Date().getTime()
    }
    oTempEvent.subjectAttrs = {
      appid: "yxy",
      openid: _This.data.oUserInfo.openId,
      unionid: _This.data.oUserInfo.unionId,
      consultantId: _This.data.cstUid,
      mobile: _This.data.oUserInfo.wechatMobile || ""
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
    wxRequest(wxaapi.event.v2.url, oData).then(function (result) {
      if (result.data.code == 0) {
      } else {
        console.log("add  event error---", result);
      }
    });
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
      //console.log("get photo result---------->", postData,result);
      if (result.data.code == 0) {
        _This.setData({
          frontface: result.data.data.positiveFace,
          sideface: result.data.data.sideFace
        });
      /*  setTimeout(function(){ 
          _This.setData({
            frontface: result.data.data.positiveFace,
            sideface: result.data.data.sideFace
          });
        },2000);*/

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
    };  //handlelike  handelsharecase
    wxRequest(wxaapi.consult.handlelike.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        if (!_This.data.tel){
          _This.setData({
            isShowMask: true
          });
        }else{
          _This.setData({ isUpload: true });
          _This.fRedirectBack();//如果用户已近授权过手机号码直接跳转回前一个页面
        
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
    wx.showLoading({
      title: '授权中...',
    });
    console.log("encryptedData----->", e);
    let eDetail = e.detail;
    if (!eDetail.encryptedData) {
      wx.hideLoading();
      return false;
    }
    eDetail.times = 0;
    _This.fAuthorization(eDetail, function (resPhone) {
      console.log("resPhone--------->",resPhone);
      if (!resPhone) {
        wx.hideLoading();
        _This.setData({
          isErrorUpload: true
        });
        setTimeout(function () {
          _This.setData({
            isErrorUpload: false
          });
        }, 2000);
        return false;
      }

      let oUserInfo = _This.data.oUserInfo;
      oUserInfo.wechatMobile = resPhone;
      _This.setData({
        oUserInfo: oUserInfo,
        isShowMask:true
      });
      wx.hideLoading();
      _This.fUpdateCustomerInfo();
    });
  },
  /**
 * 授权后更新客户手机号码
 */
  fUpdateCustomerInfo() {
    let _This = this;
    let oUserInfo = _This.data.oUserInfo;
    let pdata = {
      id: _This.data.cid,
      wechatMobile: _This.data.oUserInfo.wechatMobile
    };
    wxRequest(wxaapi.customer.update.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.fUserEvent(event.eType.authPhone);//授权手机号码事件
        _This.fRedirectBack();
      } else {
        console.log("update customer info error----", result);
      }
    });
  },
  /**
 * 用户授权 eDetail用户授权返回对象
 */
  fAuthorization(eDetail, callback) {
    let _This = this;
    getApp().fGetSessionKey(false, function (sessionKey) {
      var postData = {
        encryptedData: eDetail.encryptedData,
        sessionKey: sessionKey,
        iv: eDetail.iv
      };
      wxRequest(wxaapi.unionid.userinfo.url, postData).then(resPhone => {
        if (resPhone.data.userinfo) {
          _This.setData({
            agree: 1
          });
          callback && callback(resPhone.data.userinfo.phoneNumber);
        } else {
          _This.setData({
            agree: 0
          });
          eDetail.times++;
          if (eDetail.times > 4) {
            callback && callback(false);
            return false;
          }
          setTimeout(function () {
            _This.fAuthorization(eDetail, callback);
          }, 2000);
        }
      });
    });
  }
})