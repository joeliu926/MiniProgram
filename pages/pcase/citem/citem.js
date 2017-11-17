const event= require('../../../public/event.js');
const cmsg = require('../../../public/cmsg.js');
const apiUser = require('../../../utils/APIUinfo.js');
const tools = require('../../../utils/util.js');
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
    console.log("options===>", options)

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


      _This.getCaseList(uinfo);//获取案例
      if ((!caseIds || caseIds.length <= 0) &&!options.consultationId){
        _This.fConsultation(options.itemid, function (result) {
          console.log("result----->", result);
          _This.setData({
            consultationId: result || ""
          });
       
        });
      }else{
        _This.fCustomerMsg();
        _This.fUserEvent(event.eType.appOpen);//进入程序
        _This.fCustomerAdd();
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
    this.fUserEvent(event.eType.appQuit);//退出页面
  },


/*
 *事件参数 
 */
  fGetTempEvent(){
    var _This = this;
    var oTempEvent = _This.data.oEvent;
    var currentPage = _This.data.currentPage;
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
  onShareAppMessage: function () {
    var _This=this;
    _This.fUserEvent(event.eType.appShare); 
    var caseIds = _This.data.caseIds;
    var currentPage = _This.data.currentPage;
    if (caseIds==""){
      caseIds = _This.data.caseList[currentPage - 1].id;
    }
    return {
      title: '案例分享',
      path: '/pages/pcase/citem/citem?caseIds=' + caseIds + "&cstUid=" + _This.data.cstUid + "&itemid=" + _This.data.productCode + '&consultationId=' + _This.data.consultationId
    }
  },
  fCaseDetail: function (item) {
    var _This = this;
    var did=item.target.dataset.uid;
    wx.navigateTo({
      url: '../csdetail/csdetail?did=' + did + "&cstUid=" + _This.data.cstUid+'&consultationId=' + _This.data.consultationId
    })
  },
  /** 
   * click like 
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
          url: '/pages/pcase/tkphoto/tkphoto?consultantId=' + _This.data.cstUid + "&consultationId="+           _This.data.consultationId,
        })
      }
    });


  },

  /** 
   * click unlike 
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
          url: '/pages/pcase/tkphoto/tkphoto?consultantId=' + _This.data.cstUid + "&consultationId=" + _This.data.consultationId,
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
   


    this.setData({
      currentPage:e.detail.current+1
      });
  },
  /**
   * choose like or unlike count
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
          //console.log("result.data.data----->",result.data.data);
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
        unionid: _This.data.oUserInfo.unionId,
        userUnionid: _This.data.cstUid,
        consultationId: _This.data.consultationId
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
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
        //console.log("UserEvent------",result);
        if (result.data.code == 0) {
        } else {
          console.log("add  event error---",result);
        }
      }
    });
  },
  fCustomerMsg() {
    var _This = this;
    if (_This.data.oUserInfo.unionId == _This.data.cstUid){
      return false;
    }
    var oCustom = cmsg.custom;
    oCustom = {
      touser: "",
      msgtype: "text",
      text: {
        content: ""
      }
    };
    
    apiUser.uinfo(_This.data.cstUid, function (result) {
      //console.log("uinfo----", result.data.data.wxOpenId);
      oCustom.touser = result.data.data.wxOpenId;
      oCustom.text.content = "您的客户 " + _This.data.oUserInfo.nickName + " 于" + tools.formatTime() + " 查看了您的案例分享";
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