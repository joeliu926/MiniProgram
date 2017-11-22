const event = require('../../../public/js/wxEvent.js');
const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oUserInfo:{},
    consultationId:"",
    caseList: [
      {
        "id": 0,
        "doctorName": "",
        "customerLogo": "",
        "customerName": "",
        "caseName": "",
        "productName": "",
        "frondFile": "",
        "backFile": ""
      }
    ],
    caseIds:"",
    aCaseIds:[],
    currentPage:1,
    totalCount:0,
    cstUid:"",
    productCode:"",
    projectName:"",
    oEvent:{
      shareEventId:"",
      code: "",
      eventAttrs: {
        appletId: "hldn",
        consultingId: 0,
        consultantId:"",
        triggeredTime:"",
        case: "",
        isLike: 2,//0不喜欢 1喜欢2未选择
        image:""
      },
      subjectAttrs: {
        appid:"yxy",
        consultantId: "",
        openid: "",
        unionid: "",
        mobile: ""
      }
    },
    likeItem:"",
    likeCount:0,
    isLikeItems:{},
/////////////////////////////////////////////////////
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    isConsult: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var _This=this;
    var caseIds = options.caseIds;
    getApp().getUserData(function(uinfo){
      _This.setData({
        isConsult: caseIds ? false : true,
        caseIds: caseIds || "",
        projectName:options.iname,
        productCode: options.itemid,
        cstUid: caseIds ? options.cstUid : uinfo.unionId,
        oUserInfo: uinfo,
        consultationId: options.consultationId||"",
        likeItem:"",
        shareEventId: options.shareEventId||"",
        oEvent:event.oEvent
      });
      _This.fGetCaseList(uinfo);//获取案例
      if ((!caseIds || caseIds.length <= 0)) {
        _This.fGetConsultationId(options.itemid, function (result) {
           //console.log("fGetConsultationId----->", result);
          _This.setData({
            consultationId: result || ""
          });  
          _This.fUserEvent(event.eType.appShare);    
        });
      }
    });
  },
/*
 *事件参数 
 */
  fGetTempEvent(){
    var _This = this;
    var oTempEvent = _This.data.oEvent;
    var currentPage = _This.data.currentPage;
    oTempEvent.shareEventId = _This.data.shareEventId;
    oTempEvent.productCode = _This.data.productCode;
    oTempEvent.eventAttrs={
        consultantId: _This.data.cstUid,
        caseId: _This.data.caseList[currentPage-1].id,//
        appletId:"hldn",
        consultingId: _This.data.consultationId,
        isLike: _This.data.isLike
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var _This=this;
   // _This.fUserEvent(event.eType.appShare); //咨询师分享事件
    var caseIds = _This.data.caseIds;
    var currentPage = _This.data.currentPage;
    if (caseIds==""){
      caseIds = _This.data.caseList[currentPage - 1].id;
    }
    return {
      title: '案例分享',
      path: '/pages/client/sharecase/sharecase?caseIds=' + caseIds + "&cstUid=" + _This.data.cstUid + "&itemid=" + _This.data.productCode + '&consultationId=' + _This.data.consultationId + '&shareEventId=' + _This.data.shareEventId,
      success: function (res) {
        wx.redirectTo({
          url: '/pages/home/home'
        })
      }
    }
  },
  /**
   * 案例详情
   */
  fCaseDetail: function (item) {
    var _This = this;
    var did=item.target.dataset.uid;
    wx.navigateTo({
      url: '../csdetail/csdetail?did=' + did + "&cstUid=" + _This.data.cstUid + '&consultationId=' + _This.data.consultationId + '&shareEventId=' + _This.data.shareEventId
    })
  },
  /**
   * 咨询师改变分享的条目
   */
  fChangeShare(e){
    var citem = e.currentTarget.dataset.itemid;
    var cindex = e.currentTarget.dataset.indexi;
    var tmpList = this.data.caseList;
    var oItems = this.data.aCaseIds;
    var dindex = oItems.indexOf(citem);
    if (dindex<0){
       oItems.push(citem);
       tmpList[cindex]["current"] = citem;
     }else{
      tmpList[cindex]["current"] =-1;
      oItems.splice(dindex,1);
     }
    this.setData({
      aCaseIds: oItems,
      caseList: tmpList,
      caseIds: oItems.toString(),
      likeItem: oItems.toString()
    });
  },
  /**
   * 滑动事件，改变当前的信息
   */
  fSwiperChange:function(e){
    this.setData({
      currentPage:e.detail.current+1
      });
  },

  /**
   * 获取会话ID，咨询师获取会话ID进行消息分享
   */
  fGetConsultationId(sItem, callback) {
    
    let _This = this;
    if (_This.data.consultationId){
      callback(_This.data.consultationId);
      return false;
    }
    let pdata = {
      wxaOpenId: _This.data.oUserInfo.openId,
      unionId: _This.data.oUserInfo.unionId,
      consultationId: _This.data.consultationId,
      userLoginName: "",
      productCode: sItem,
      wxNickName: _This.data.oUserInfo.nickName,
    };
    wxRequest(wxaapi.consult.add.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        callback(result.data.data);
      } else {
        console.log("addconsultation error==", result);
      }
    });
  },
  /**
   * 用户事件
   */
  fUserEvent(eType){
    let _This = this;
    _This.fGetTempEvent();
    var oData = _This.data.oEvent;
    oData.eventAttrs.triggeredTime=new Date().valueOf();
    oData.code = eType;
    wxRequest(wxaapi.event.add.url, oData).then(function (result) {
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
  /**
   *获取案例列表 
   */
  fGetCaseList(uinfo) {
    let _This = this;
    var pdata = {
      unionId: uinfo.unionId,
      productCode: _This.data.productCode,
      caseIds: _This.data.caseIds
    };
    wxRequest(wxaapi.pcase.list.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
          caseList: result.data.data,
          totalCount: result.data.data.length
        });
      } else {
        console.log("case list----", result);
      }
    });
  }
  

})