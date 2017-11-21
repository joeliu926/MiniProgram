const event= require('../../../public/event.js');
const cmsg = require('../../../public/cmsg.js');
const tools = require('../../../utils/js/util.js');
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
    //console.log("options===>", options);

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
     // if ((!caseIds || caseIds.length <= 0) &&!options.consultationId){
      if ((!caseIds || caseIds.length <= 0)) {
        _This.fGetConsultationId(options.itemid, function (result) {
           //console.log("fGetConsultationId----->", result);
          _This.setData({
            consultationId: result || ""
          });  
          _This.fUserEvent(event.eType.appShare);    
        });

      }else{
        _This.fCustomerAdd();//客户添加
        _This.fUserEvent(event.eType.appOpen);//进入程序
        _This.fCustomerMsg();//发送客服消息    
      };
    });
  },

  /**
    * 生命周期函数--监听页面初次渲染完成
    */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    //this.fUserEvent(event.eType.appQuit);//退出页面
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
    //console.log(e);
    var _This=this;
   // _This.fUserEvent(event.eType.appShare); //咨询师分享事件
    var caseIds = _This.data.caseIds;
    var currentPage = _This.data.currentPage;
    if (caseIds==""){
      caseIds = _This.data.caseList[currentPage - 1].id;
    }
    return {
      title: '案例分享',
      path: '/pages/pcase/citem/citem?caseIds=' + caseIds + "&cstUid=" + _This.data.cstUid + "&itemid=" +     _This.data.productCode + '&consultationId=' + _This.data.consultationId + '&shareEventId=' + _This.data.shareEventId,
         success: function (res) {
        wx.redirectTo({
          url: '/pages/home/home'
        }) 
       }
    }
  },
  fCaseDetail: function (item) {
    var _This = this;
    var did=item.target.dataset.uid;
    wx.navigateTo({
      url: '../csdetail/csdetail?did=' + did + "&cstUid=" + _This.data.cstUid + '&consultationId=' + _This.data.consultationId + '&shareEventId=' + _This.data.shareEventId
    })
  },
  /** 
   * C端用户 喜欢案例
   */
  fLikeCase: function () {
    var _This = this;
    _This.setData({
      isLike:1
    });
    _This.fUserEvent(event.eType.caseLike);
    _This.fSelectIsLike("y",function(result){
      if(result){
        wx.navigateTo({
          url: '/pages/pcase/tkphoto/tkphoto?consultantId=' + _This.data.cstUid + "&consultationId=" + _This.data.consultationId + '&shareEventId=' + _This.data.shareEventId
        })
      }
    });
  },

  /** 
   * C端用户 不喜欢案例
   */
  fUnlikeCase: function () {
    var _This = this;
    _This.setData({
      isLike: 0
    });
    _This.fUserEvent(event.eType.caseLike);
    _This.fSelectIsLike("n",function (result) {
      if (result) {
        wx.navigateTo({
          url: '/pages/pcase/tkphoto/tkphoto?consultantId=' + _This.data.cstUid + "&consultationId=" + _This.data.consultationId + '&shareEventId=' + _This.data.shareEventId
        })
      }
    });
  },
  fShareMessage: function () {
    wx.showShareMenu({
      withShareTicket: true
    });
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
   * C端用户选择喜欢 不喜欢，控制BUTTON样式
   */
  fSelectIsLike(param,callback){
    var _This = this;
    var selectItems = _This.data.isLikeItems;
    var lcount = _This.data.likeCount;
    if (!selectItems["" + _This.data.currentPage + ""]) {
      lcount +=1;
    }

    selectItems["" + _This.data.currentPage + ""] = param;
    _This.setData({
      isLikeItems: selectItems,
      likeCount: lcount
    });

    if (_This.data.likeCount == _This.data.caseList.length){
      callback(true);
    }else{
      callback(false);
    }  
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
   * 客户添加，当用户点击进来的时候添加或者更新用户信息
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
      consultationId: _This.data.consultationId,
      shareEventId: _This.data.shareEventId
    };
    wxRequest(wxaapi.customer.add.url, pdata).then(function (result) {
     // console.log("000000000000000000000000===>", result);
      if (result.data.code == 0) {
        // callback(result.data.data);
      } else {
        console.log("addcustomer error----", result);
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
      //console.log("000000000000000000000000===>", result);
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
   * 发送客服消息
   */
  fCustomerMsg() {
    var _This = this;
    if (_This.data.oUserInfo.unionId == _This.data.cstUid){
      return false;
    }
    var sendMsg = "您的客户 " + _This.data.oUserInfo.nickName + " 于" + tools.formatTime() + " 查看了您的案例分享";
    cmsg.fSendWxMsg(_This.data.cstUid, sendMsg);
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