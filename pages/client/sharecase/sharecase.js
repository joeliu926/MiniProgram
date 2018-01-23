const event = require('../../../public/js/wxEvent.js');
const wxCustomerMsg = require('../../../public/js/wxCustomerMsg.js');
const tools = require('../../../utils/js/util.js');
const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    oUserInfo: {},
    consultationId: "",
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
    caseIds: "",
    aCaseIds: [],
    currentPage: 1,
    totalCount: 0,
    cstUid: "",
    productCode: "",
    projectName: "",
    oEvent: {
      shareEventId: "",
      code: "",
      eventAttrs: {
        appletId: "hldn",
        consultingId: 0,
        consultantId: "",
        triggeredTime: "",
        case: "",
        isLike: 2,//0不喜欢 1喜欢2未选择
        image: ""
      },
      subjectAttrs: {
        appid: "yxy",
        consultantId: "",
        openid: "",
        unionid: "",
        mobile: ""
      }
    },
    likeItem: "",
    likeCount: 0,
    isLikeItems: {},
    /////////////////////////////////////////////////////
    aisLikeIndex:[],
    indicatorDots: false,
    autoplay: false,
    currentIndex: 0,
    interval: 5000,
    duration: 1000,
    isConsult: true

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _This = this;
    var caseIds = options.caseIds;
    console.log("share case --option--",options);

    getApp().getUserData(function (uinfo) {
      console.log("-------user info=====>", uinfo);
      _This.setData({
        isConsult: caseIds ? false : true,
        caseIds: caseIds || "",
        projectName: options.iname,
        productCode: options.itemid,
        cstUid: caseIds ? options.cstUid : uinfo.unionId,
        oUserInfo: uinfo,
        consultationId: options.consultationId || "",
        likeItem: "",
        shareEventId: options.shareEventId || "",
        oEvent: event.oEvent
      });
      _This.fGetCaseList(uinfo);//获取案例
        _This.fCustomerAdd();//客户添加
        //_This.fUserEvent(event.eType.appOpen);//进入程序
        //_This.fCustomerMsg();//发送客服消息 
    });
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
  fGetTempEvent() {
    var _This = this;
    var oTempEvent = _This.data.oEvent;
    var currentPage = _This.data.currentPage;
    oTempEvent.shareEventId = _This.data.shareEventId;
    oTempEvent.productCode = _This.data.productCode ? _This.data.productCode:[];

    //console.log("_This.data.caseList[currentPage - 1].id===>", _This.data.caseList[currentPage - 1].id);

    oTempEvent.eventAttrs = {
      consultantId: _This.data.cstUid,
      caseId: _This.data.caseList[currentPage - 1].id,//
      appletId: "hldn",
      consultingId: _This.data.consultationId,
      isLike: _This.data.isLike,
      clueId: "", //线索id  
      sceneId: "",
      reserveId: "",//
      agree: "",  //1是允许，0是拒绝
      imgNum: "",
      imgUrls: [],
      remark: '',
      triggeredTime: new Date().getTime()
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
    var _This = this;
    var caseIds = _This.data.caseIds;
    var currentPage = _This.data.currentPage;
    if (caseIds == "") {
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
  fCaseDetail: function (item) {
    var _This = this;
    var did = item.target.dataset.uid;
    wx.navigateTo({
      url: './detail/detail?did=' + did + "&cstUid=" + _This.data.cstUid + '&consultationId=' + _This.data.consultationId + '&shareEventId=' + _This.data.shareEventId
    })
  },
  /** 
   * C端用户 喜欢案例
   */
  fLikeCase: function () {
    var _This = this;
    _This.setData({
      isLike: 1
    });

    

    _This.fUserEvent(event.eType.caseLike);
    _This.fSelectIsLike("y", function (result) {
      if (result) {
        wx.navigateTo({
          url: './tkphoto/tkphoto?consultantId=' + _This.data.cstUid + "&consultationId=" + _This.data.consultationId + '&shareEventId=' + _This.data.shareEventId
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
    _This.fSelectIsLike("n", function (result) {
      if (result) {
        wx.navigateTo({
          url: './tkphoto/tkphoto?consultantId=' + _This.data.cstUid + "&consultationId=" + _This.data.consultationId + '&shareEventId=' + _This.data.shareEventId
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
   * 滑动事件，改变当前的信息
   */
  fSwiperChange: function (e) {
    this.setData({
      currentPage: e.detail.current + 1
    });
  },
  /**
   * C端用户选择喜欢 不喜欢，控制BUTTON样式
   */
  fSelectIsLike(param, callback) {
    let _This = this;
    let selectItems = _This.data.isLikeItems;
    let lcount = _This.data.likeCount;
    let currentPage = _This.data.currentPage;
    if (!selectItems["" + currentPage + ""]) {
      lcount += 1;
    }

    selectItems["" + currentPage + ""] = param;

    let aisLikeIndex = _This.data.aisLikeIndex;//数组
    let isExistIndex=aisLikeIndex.indexOf((currentPage-1));
    if (isExistIndex>=0){
      aisLikeIndex.splice(isExistIndex,1);
    }
    _This.setData({
      isLikeItems: selectItems,
      likeCount: lcount,
      currentIndex: aisLikeIndex.length > 0 ? aisLikeIndex[0] : 0,
      aisLikeIndex: aisLikeIndex
    });

    if (_This.data.likeCount == _This.data.caseList.length) {
      callback(true);
    } else {
      callback(false);
    }
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
  fUserEvent(eType) {
    let _This = this;
    _This.fGetTempEvent();
    var oData = _This.data.oEvent;
    oData.eventAttrs.triggeredTime = new Date().valueOf();
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
    if (_This.data.oUserInfo.unionId == _This.data.cstUid) {
      return false;
    }
    var sendMsg = "您的客户 " + _This.data.oUserInfo.nickName + " 于" + tools.formatTime() + " 查看了您的案例分享";
    wxCustomerMsg.fSendWxMsg(_This.data.cstUid, sendMsg);
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
    console.log("get post data----->", pdata);
    wxRequest(wxaapi.pcase.list.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        console.log("share result.data.data========>",result.data.data);
        let aisLikeIndex=[];
        for (let i = 0, iLength = result.data.data.length; i < iLength;i++){
          aisLikeIndex.push(i);
        }
        //console.log("share result.aisLikeIndex.data========>", aisLikeIndex);
        _This.setData({
          caseList: result.data.data,
          totalCount: result.data.data.length,
          aisLikeIndex: aisLikeIndex
        });
        _This.fUserEvent(event.eType.appOpen);//进入程序
        _This.fCustomerMsg();//发送客服消息 
      } else {
        console.log("share case list----", result);
      }
    });
  }


})