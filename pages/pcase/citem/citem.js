const event= require('../../../public/event.js')
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
      code: "",
      eventAttrs: {
        appletId: "hldn",
        consultingId: 0,
        consultantId:"",
        triggeredTime:"",
        case: "",
        isLike: "",
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
    console.log("onload--------------");
   // console.log("+++++++++++++++++++++++++");
   // console.log(options);
   // console.log("+++++++++++++++++++++++++");
    var _This=this;
    var caseIds = options.caseIds;
    getApp().getUserData(function(uinfo){
     // console.log(uinfo);
      _This.setData({
        isConsult: caseIds ? false : true,
        caseIds: caseIds || "",
        projectName:options.iname,
        productCode: options.itemid,
        cstUid: caseIds ? options.cstUid : uinfo.unionId,
        oUserInfo: uinfo,
        consultationId: options.consultationId||"",
        likeItem:"",
         oEvent:event.oEvent
      });

      console.log("caseIds------", caseIds);
      _This.getCaseList(uinfo);
      if (!caseIds||caseIds.length<=0){
        _This.fConsultation(options.itemid, function (result) {
          console.log("---22222222222------", result);
          _This.setData({
            consultationId: result || ""
          });
          _This.fUserEvent(event.eType.appOpen);//进入程序
        });
      };
      _This.fCustomerAdd();
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
    this.fUserEvent(event.eType.appQuit);//退出页面
  },


/*
 *事件参数 
 */
  fGetTempEvent(){
    var _This = this;
    var oTempEvent = _This.data.oEvent;
    oTempEvent.eventAttrs={
        consultantId: _This.data.cstUid,
        caseId:_This.data.likeItem,
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
  onShareAppMessage: function () {
    console.log("----------share----------");
    
    var _This=this;
    _This.fUserEvent(event.eType.appShare);
    return {
      title: '案例分享',
      path: '/pages/pcase/citem/citem?caseIds=' + _This.data.caseIds + "&cstUid=" + _This.data.cstUid + "&itemid=" + _This.data.productCode + '&consultationId=' + _This.data.consultationId
    }
  },
  fCaseDetail: function (item) {
    var did=item.target.dataset.uid;
    wx.navigateTo({
      url: '../csdetail/csdetail?did=' + did,
    })
  },
  /** 
   * click like 
  */

  fLikeCase: function () {
    _This.fUserEvent(event.eType.appShare);
    wx.navigateTo({
      url: '/pages/pcase/tkphoto/tkphoto',
    })
  },

  /** 
   * click unlike 
  */
  fUnlikeCase: function () {

  },
  fShareMessage: function () {
    console.log("show share");
 
    wx.showShareMenu({
      withShareTicket: true
    });
  },
  /**
   * change share datat
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
  fSwiperChange:function(e){
    this.setData({currentPage:e.detail.current+1});
  },
  /**
   * get case list
   */
  getCaseList(uinfo) {
    let _This = this;
    wx.request({
      url: "https://27478500.qcloud.la/wxa/case/list",
      method: "POST",
      data: {
        unionId: uinfo.unionId,
        productCode: _This.data.productCode,
        caseIds: _This.data.caseIds
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
        if (result.data.code == 0) {
         // console.log(result);
          _This.setData({ 
            caseList: result.data.data,
            totalCount: result.data.data.length    
           });
        } else {
          console.log("case list----",result);
        }
      }
    });
  },
  /**
   * add consultation
   */
  fConsultation(sItem, callback) {
    let _This = this;
    wx.request({
      url: "https://27478500.qcloud.la/wxa/consult/addconsultation",
      method: "POST",
      data: {
        wxaOpenId: _This.data.oUserInfo.openId,
        unionId: _This.data.oUserInfo.unionId,
        consultationId: _This.data.consultationId,
        userLoginName: "",
        productCode: sItem,
        wxNickName: _This.data.oUserInfo.nickName,
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
        //console.log(result);
        if (result.data.code == 0) {
          callback(result.data.data);
        } else {
          console.log("addconsultation error==",result);
        }
      }
    });
  },
  /**
   * add customer
   */
    fCustomerAdd() {
    let _This = this;
    wx.request({
      url: "https://27478500.qcloud.la/wxa/customer/addcustomer",
      method: "POST",
      data: {
        openid: _This.data.oUserInfo.openId,
        wxNickname: _This.data.oUserInfo.nickName,
        gender: _This.data.oUserInfo.gender,
        province: _This.data.oUserInfo.province,
        city: _This.data.oUserInfo.city,
        country: _This.data.oUserInfo.country,
        logo: _This.data.oUserInfo.avatarUrl,
        unionid: _This.data.oUserInfo.unionId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
       // console.log("--------------------");
        //console.log(result);
        //console.log("--------------------");
        if (result.data.code == 0) {
         // callback(result.data.data);
        } else {
          console.log("addcustomer error----",result);
        }
      }
    });
  },
  fUserEvent(eType){
    
    let _This = this;
    _This.fGetTempEvent();
    var oData = _This.data.oEvent;
    oData.eventAttrs.triggeredTime=new Date().valueOf();
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
          console.log("add  event error---",result);
        }
      }
    });
  }
  

})