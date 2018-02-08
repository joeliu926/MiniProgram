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
    oUserInfo: {},//当前用户信息
    oGift:{},//礼品详情
    noPhoneCount:0,//目标人群
    giftid:0,//获取的礼品id
    shareType: 4,//分享类型  1朋友圈 2分享到群 3分享到好友 4召回有礼
    consultType: 3,//"推广类型 1案例分享 2海报 3到店有礼"
    consultationId:""//会话id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("options------------->", options);
    let _This = this;
    getApp().getUserData(function (uinfo) {
      //console.log("uinfo------------->", uinfo);
      _This.setData({
        oUserInfo: uinfo,
        cstUid:uinfo.unionId,
        options: options,
        oEvent: event.oEvent //事件参数
      });

      _This.fGiftDetail();
      _This.fGetCroudList();
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
  /**
 * 获取礼品详情
 */
  fGiftDetail() {
    let _This = this;
    let pdata = {
      id: _This.data.options.giftid
    };
   // console.log("preview post data--->", pdata);
    wxRequest(wxaapi.gift.giftdetail.url, pdata).then(function (result) {
      //console.log("get giftdetail --->", result);
      if (result.data.code == 0) {
        _This.setData({
          oGift: result.data.data
        });
      }
    });
  },
  /**
 * 获取目标人群接口V0.3.3
 */
  fGetCroudList() {
    let _This = this;
    let pdata = {
      types: 1,
      consultUnionId: _This.data.oUserInfo.unionId
    };
    //console.log("post data--->", pdata);
    wxRequest(wxaapi.consult.getcluesbyconsultid.url, pdata).then(function (result) {
      console.log("get getcluesbyconsultid by sessionid--->", result);
      if (result.data.code == 0) {
        _This.setData({
          noPhoneCount: result.data.data["1"]
        });
      }
    });
  },
  /**
   * 发送礼品
   */
  fSendGift(){
   console.log("send gift---'");
   let _This=this;
   _This.fGetConsultationId();
  },
  /**
 * 获取会话ID，咨询师获取会话ID进行消息分享
 */
  fGetConsultationId() {
    let _This = this;
      wx.showLoading({
        title: '发送中...',
      });
      let pdata = {
        wxaOpenId: _This.data.oUserInfo.openId,
        unionId: _This.data.oUserInfo.unionId,
        consultationId: _This.data.consultationId,
        userLoginName: "",
        productCode: "",
        wxNickName: _This.data.oUserInfo.nickName,
        consultType: _This.data.consultType
      };
    wxRequest(wxaapi.consult.add.url, pdata).then(function (result){
      console.log("consultationId------------->", result);
      if (result && result.data.code == 0) {
         _This.setData({
          consultationId: result.data.data
         });
          wx.hideLoading();
          _This.fUpdateShare();
      }

      let pSendData = {
        types: 1,
        consultUnionId: _This.data.oUserInfo.unionId,
        giftId: _This.data.oGift.id,
        sessionId: _This.data.consultationId
      };
      console.log("a pSendData sult----->", pSendData);
      return wxRequest(wxaapi.consult.addconsultrecord.url, pSendData);
    }).then(function (updateresult){
      console.log("add consultrecord result----->", updateresult);
      if (updateresult.data.code != 0) {
        wx.hideLoading();
        wx.showToast({
          title: '发送失败',
          icon: 'loading',
          duration: 2000
        });
       // return false;
      }else{
        wx.showToast({
          title: '已发送',
        });
        wx.redirectTo({
          url: '/pages/index/home?type=share',
        });
      }
     
       wx.hideLoading();
    });
  },

  /**
   * 用户分享以后更新分享内容
   */
  fUpdateShare() {
    let _This = this;
    let shareData = {
      cases: _This.data.aCaseIds,//案例列表Id
      consultingId: _This.data.consultationId,//会话id
      consultantUnionid: _This.data.oUserInfo.unionId,//咨询师unionid
      products: _This.data.productcodes||[],//项目列表id  [3002,3025,3028]
      type: _This.data.shareType, // 
      consultType: _This.data.consultType,
      gifts: [_This.data.oGift.id]
    };
    wxRequest(wxaapi.consult.consultantupdate.url, shareData).then(function (result) {
      if (result.data.code == 0) {
 
      } else {
        console.log(result);
      }
      wx.hideLoading();
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
      caseId:"",
      appletId: "hldn",
      consultingId: _This.data.consultationId,
      isLike:"",
      clueId: "",//无
      reserveId: "",//无
      sceneId: _This.data.consultationId, //会话id
      giftId: _This.data.oGift.id,
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
  },
  /**
  * 获取m 和n
  */
  fGetPrompt() {
    let _This = this;
    let pdata = {
      sessionId: "",
      consultUnId: _This.data.oUserInfo.unionId
    };
    wxRequest(wxaapi.consult.getprompt.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        // let noCount =0;
        _This.setData({
          oMn: result.data.data
        });
      }
    });
  }


})