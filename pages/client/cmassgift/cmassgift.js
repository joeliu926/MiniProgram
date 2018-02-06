const event = require('../../../public/js/wxEvent.js');
const tools = require('../../../utils/js/util.js');
const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
const wxPromise = require('../../../utils/js/wxPromise.js');//promise信息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oGift:{},//礼品对象
    aGiftList:["11","22","33"],//礼品列表
    isShowMask:false,//显示授权手机号码提示框
    oUserInfo:{},//当前用户信息
    iTop:false,//向上移动
    currentRecoder:{},//当前的弹框
    aAuthRecoder: [],//所有授权手机人
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    status:0,//领取状态 1是已经领取
    isPast:false,//是否过去false没过期，true过期
    current: 0,//图片当前页
    totalPic: 1,//图片总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This=this;
    getApp().getUserData(function (uinfo) {
      //console.log("uinfo------------->", uinfo);
      _This.setData({
        oEvent: event.oEvent, //事件参数
        oUserInfo: uinfo,
        giftid: options.giftid||8,
        cstUid: options.cstUid || uinfo.unionId,
        consultationId: options.consultationId||"1727",
        options: options
      });
      _This.fGiftDetail();//获取礼品详情
      _This.fCustomerAdd();//添加客户，生成线索
      _This.fGetCustomerByUnionid();//获取客户信息
      _This.fGetBubblePrompt();//获取气泡

    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     let pdata={
       clueId :"",
       consultUnId: "",
       customerUnId : "",
       giftId:"",
       giftName:"",
       sessionId:"",
       wechatMobile: "",
     }
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
    let _This=this;
    let giftid = _This.data.giftid;
    let cstUid = _This.data.cstUid;
    let consultationId = _This.data.consultationId;
    return {
      title: '礼品分享',
      path: `/pages/client/cmassgift/cmassgift?giftid=${giftid}&cstUid=${cstUid}&consultationId=${consultationId}`,
      success: function (res) {}
      }
  },
  /**
   * 循环气泡
   */
  fFlowData(){
    let _This=this;
    let mType = false;
    let i = 1;
    let aLength = _This.data.aAuthRecoder.length || 1;
    setInterval(function () {
      mType = !mType;
      let citem = _This.data.aAuthRecoder[i % aLength];
      _This.setData({
        iTop: mType,
        currentRecoder: citem
      });
      //console.log("1111--i--mType------>", mType);
      if (!mType) {
        console.log("i--mType------>", mType);
        //console.log("---------------------");
        mType = !mType;
        _This.setData({
          iTop: mType
        });
      }

      i++;
    }, 3000);
  },
  /**
 * 获取气泡
 */
  fGetBubblePrompt() {
    let _This = this;
    let pdata = {
      sessionId: _This.data.consultationId,
      consultUnId: _This.data.cstUid
    };
    wxRequest(wxaapi.activityrecord.getbubbleprompt.url, pdata).then(function (result) {
      console.log("------bubble----",result);
      if (result.data.code == 0) {
        _This.setData({
          aAuthRecoder: result.data.data,
          currentRecoder: result.data.data[0]
        });
        _This.fFlowData();//获取气泡
      }
    });
  },
  /**
   * 获取礼品详情
   */
  fGiftDetail(){
    let _This = this;
    let pdata = {
      id: _This.data.giftid
    };
    //console.log("post data--->", pdata);
    wxRequest(wxaapi.gift.giftdetail.url, pdata).then(function (result) {
      console.log("get giftdetail --->", result);
      if (result.data.code == 0) {
        _This.setData({
          oGift: result.data.data,
          totalPic: result.data.data.giftPictures.length,
          isPast: (new Date().valueOf()>result.data.data.validity)
        });
        _This.fGetReceiveDetail();
      }
    });
  },
  /**
   * 获取领取详情
   */
  fGetReceiveDetail(){
     let _This = this;
     let pdata = {
       sessionId: _This.data.consultationId,
       customerUnId: _This.data.oUserInfo.unionId,
       consultUnId: _This.data.cstUid
     };
     wxRequest(wxaapi.activityrecord.getdetail.url, pdata).then(function (result) {
        if (result.data.code == 0 && result.data.data.status) {
         _This.setData({
           status:result.data.data.status
         });
       }
     });
   },
  /**
   * 客户添加或者更新,返回线索id
   */
  fCustomerAdd() {
    let _This = this;
    let pdata = {
      openid: _This.data.oUserInfo.openId,
      wxNickname: _This.data.oUserInfo.nickName,
      gender: _This.data.oUserInfo.gender,
      province: _This.data.oUserInfo.province,
      city: _This.data.oUserInfo.city,
      country: _This.data.oUserInfo.country,
      logo: _This.data.oUserInfo.avatarUrl,
      unionid: _This.data.oUserInfo.unionId,
      userUnionid: _This.data.cstUid,
      consultationId: _This.data.consultationId
    };
    wxRequest(wxaapi.consult.entry.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
          clueId: result.data.data.clueId
        });
        _This.fUserEvent(event.eType.openGift);//进入打开礼品
      } else {
        console.log("addcustomer error----", result);
      }
    });
  },
  /**
* 授权后更新客户手机号码
*/
  fUpdateCustomerInfo() {
    let _This = this;
    let oUserInfo = _This.data.oUserInfo;
    let pdata = {
      id: _This.data.oUserInfo.id,
      wechatMobile: _This.data.wechatMobile
    };
    wxRequest(wxaapi.customer.update.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.fReceiveGift();//领取礼物
        _This.fUserEvent(event.eType.getGift);//领取礼品号码事件
      } else {
        console.log("update customer info error----", result);
      }
    });
  },
  /**
   * 领取礼品
   */
fReceiveGift(){
  let _This = this;
  let pdata = {
    clueId: _This.data.clueId,
    consultUnId: _This.data.cstUid,
    customerUnId: _This.data.oUserInfo.unionId,
    giftId: _This.data.giftid,
    giftName: _This.data.oGift.name,
    sessionId: _This.data.consultationId,
    wechatMobile: _This.data.wechatMobile,
  }
  wxRequest(wxaapi.activityrecord.create.url, pdata).then(function (result) {
    if (result.data.code == 0) {
      wx.showToast({
        title: '领取成功',
        duration: 2000,
        complete:function(res){
          console.log("-=-=-=-=-=-=-=-=-=-=-",res);
          wx.navigateTo({
            url: 'giftsuccess/giftsuccess?unionId=' + _This.data.cstUid,
          })
        }
      })
      _This.setData({
        status: 1
      });
    }
  });
},
  /**
   * 切换改变
   */
  fSwiperChange(e){
    this.setData({
      current:e.detail.current
    });
  },
  /**
   * 立即领取formId
   */
  fFormRightNow(e){
    let _This=this;
    if (_This.data.status>0){
      return false;
    }
    _This.setData({
      isShowMask: true,
      formId: e.detail.formId
    });
    _This.fGetCustomerFormid();
  },
  /**
* 获取客户的formid
*/
  fGetCustomerFormid() {
    let _This = this;
    let pdata = {
      customerUnionid: _This.data.oUserInfo.unionId,
      customerOpenid: _This.data.oUserInfo.openId,
      consultUnionid: _This.data.cstUid,//咨询师unionid
      sessionId: _This.data.consultationId,//当前会话id
      formId: _This.data.formId //一次提交的formid
    };
    wxRequest(wxaapi.wxaqr.addformid.url, pdata).then(function (result) {
      console.log("post data insert into customer formid----", result);
      if (result.data.code == 0) {
      }
    });
  },
  /**
   * 联系咨询师页面
   */
  fConnectCst(){
    let cstUid = this.data.cstUid;
    wx.navigateTo({
      url: '/pages/client/ccase/counselor/counselor?cstUid=' + cstUid,
    })
  },
  /**
   * 关闭授权手机
   */
  fClose(){
    let _This = this;
    _This.setData({
      isShowMask: false
    });
  },
  /**
   * 授权获取手机号码
   */
  getPhoneNumber(e) {
    let _This = this;
    _This.setData({
      isShowMask: false
    });
    wx.showLoading({
      title: '授权中...',
    });
    let eDetail = e.detail;
    if (!eDetail.encryptedData) {
      wx.hideLoading();
      return false;
    }
    _This.fAuthorization(eDetail, function (resPhone) {
      _This.setData({
        wechatMobile: resPhone
      });
      _This.fUpdateCustomerInfo(); //授权手机号码更新客户信息
      wx.hideLoading();
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
          callback && callback(false);
        }
      });
    });
  },
  /**
 * 通过咨询师unionid和客户unionid获取客户信息
 */
  fGetCustomerByUnionid() {
    let _This = this;
    let oUserInfo = _This.data.oUserInfo;
    let pdata = {
      consultantUnionid: _This.data.cstUid,
      unionid: _This.data.oUserInfo.unionId
    };
    wxRequest(wxaapi.customer.getcustomerbyunid.url, pdata).then(function (result) {
      //console.log("get customer info result---->", result);
      if (result.data.code == 0) {
        oUserInfo.wechatMobile = result.data.data.wechatMobile;
        oUserInfo.id = result.data.data.id;
        _This.setData({
          oUserInfo: oUserInfo
        });
      } else {
        console.log("get customer info error----", result);
      }
    });
  },
  /**
* 用户事件
*/
  fUserEvent(eType) {
    let _This = this;
    _This.fGetTempEvent();
    var oData = _This.data.oEvent;
    oData.code = eType;
    wxRequest(wxaapi.event.v2.url, oData).then(function (result) {
      if (result.data.code == 0) {
        if (!oData.shareEventId) {
          // oData.shareEventId = result.data.data;
          _This.setData({
            shareEventId: result.data.data
          });
        };
      } else {
        console.log("add  event error---", result);
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
    oTempEvent.productCode = [""];
    oTempEvent.consultationId = _This.data.consultationId,
      oTempEvent.sceneId = _This.data.consultationId;
    oTempEvent.eventAttrs = {
      consultantId: _This.data.cstUid,
      caseId: "",
      appletId: "hldn",
      consultingId: _This.data.consultationId,
      isLike: "",
      clueId: "",//无
      reserveId: "",//无
      sceneId: _This.data.consultationId, //会话id
      giftId: _This.data.giftId,
      agree: "",
      unionid: _This.data.oUserInfo.unionId,
      openid: _This.data.oUserInfo.openId,
      imgNum: "",
      imgUrls: [],
      remark: '',
      triggeredTime: new Date().valueOf()
    }
    oTempEvent.subjectAttrs = {
      appid: "yxy",
      consultantId: _This.data.cstUid,
      openid: _This.data.oUserInfo.openId,
      unionid: _This.data.oUserInfo.unionId,
      mobile: ""
    };
    _This.setData({
      oEvent: oTempEvent
    });
  }


})