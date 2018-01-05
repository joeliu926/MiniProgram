const event = require('../../../public/js/wxEvent.js'); //事件上报相关参数
const wxaapi = require('./../../../public/wxaapi.js');//api地址参数
const wxRequest = require('./../../../utils/js/wxRequest.js'); //请求参数
const wxPromise = require('./../../../utils/js/wxPromise.js');//promise信息

var touchDotX = 0;//触摸时的原点
var touchDotY = 0;//触摸时的原点
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aCaseList: [{ id: 0, item: "red" }, { id: 1, item: "green" }, { id: 2, item: "blue" }, { id: 3, item: "purple" }],
    aCurrentList: [],//选中项
    itemLeft: 0,//左侧位置
    caseCount:4,//案例总数
    itemTop: 20,//顶部位置
    isShowTip:false,//是否显示授权手机号码的tip
    oUserInfo:{}, //当前用户信息
    clueId:"",
    currentPage:1,
    totalCount:1,
    caseList:["案例一","案例二","案例三"],
    detailInfo: {
      "doctorName": "",
      "contentList": [
        {
          "title": "术后20天",
          "description":"这是第一个的描述信息，一定要仔细去看",
          "definitionDate":"2017-11-12",
          "pictures": ["",""]
        },
        {
          "title": "术后25天",
          "description": "这是第二个的描述信息，一定要仔细去看，哎呀这个不错啊",
          "definitionDate": "2017-11-22",
          "pictures": ["", "", "", "11", "222"]
        },
        {
          "title": "术后30天",
          "description": "这是第三个的描述信息，一定要仔细去看，这个更好了，继续发展，你会看到变化",
          "definitionDate": "2017-11-30",
          "pictures": ["","",""]
        },
        {
          "title": "术后35天",
          "description": "这是第四个的描述信息，一定要仔细去看，这个是最后的，你看到了可以袭击决定怎么处理",
          "definitionDate": "2017-12-12",
          "pictures": ["", "11", "222", "11", "222"]
        }
      ]
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    console.log("event------>event",event);

  let _This=this;
  var caseIds = options.caseIds;
/******** qiehuan*********/
  let aCaseList = _This.data.aCaseList;
  _This.setData({
    aCurrentList: aCaseList.slice(0, 10)
  });
/***********qiehuan******/
  getApp().getUserData(function (uinfo) {
    console.log("-------user info=====>", uinfo);
    _This.setData({
      caseIds: caseIds || "",
      projectName: options.iname,
      productCode: options.itemid,
      cstUid: caseIds ? options.cstUid : uinfo.unionId,
      oUserInfo: uinfo,
      consultationId: options.consultationId || "1420",
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 获取案例列表
   */
  fGetCaseList(){
    console.log("get case list");
  },
  /**
   * 客户添加或者更新,返回用户
   */
  fCustomerAdd(){
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
    console.log("---fCustomerAdd---pdata---------->", pdata);
    wxRequest(wxaapi.consult.entry.url, pdata).then(function (result) {
      console.log("------result---------->", result);
      if (result.data.code == 0) {
        _This.setData({
          clueId: result.data.data.clueId
        });
      } else {
        console.log("addcustomer error----", result);
      }
    });
  },
  /*
 *事件参数 
 */
  fGetTempEvent() {
    var _This = this;
    var oTempEvent = _This.data.oEvent;
    var currentPage = _This.data.currentPage;
    oTempEvent.shareEventId = _This.data.shareEventId;
    oTempEvent.productCode = _This.data.productCode;
    oTempEvent.clueId=_This.data.clueId; //线索id
    oTempEvent.consultationId=_This.data.consultationId;//咨询会话ID
    oTempEvent.eventAttrs = {
      consultantId: _This.data.cstUid,
      caseId: _This.data.caseList[currentPage - 1].id,//
      appletId: "hldn",
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










  fTakePhoto(){
    console.log("the doctor take photo--->");
  },
  fGetCaseData(){
    let _This = this;
    let caseCount = _This.data.detailInfo.contentList.length || 1;
    let countRate = parseInt(100 / caseCount);
  },
  fTestPhone(){
    console.log("--------点击触发事件--------");
  },
  /**
   * 获取手机号码
   */
  getPhoneNumber(e) {
    console.log("------", e);
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
      console.log("sessionKey----->", sessionKey);
      var postData = {
        encryptedData: encryptedData,
        sessionKey: sessionKey, iv: iv
      };
      return wxRequest(wxaapi.unionid.userinfo.url, postData);
    }).then(resAll => {
      console.log("resAll----->", resAll);
    });
  },



/*************** 滚动事件 开始************************/
  // 触摸开始事件
  fTouchStart: function (e) {
    // console.log("e.touches[0]------->", e, e.currentTarget.dataset.caseitem);
    let caseItem = e.currentTarget.dataset.caseitem;
    this.setData({
      currentItem: caseItem,
      isShowTip:true
    });
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点touchDotX
    touchDotY = e.touches[0].pageY; // 获取触摸时的原点touchDotY
  },
  fTouchMove: function (e) {
    //console.log("e.touches[0]------->", e.touches[0]);
    let _This = this;
    let tX = (e.touches[0].pageX - touchDotX);
    let tY = (e.touches[0].pageY - touchDotY);
    let currentItem = _This.data.currentItem;
    _This.fGenerateShow(currentItem, tX);
    if (Math.abs(tY) < Math.abs(tX)) {
      _This.setData({
        itemLeft: (tX + "px"),
        itemTop: (tY + "px")
      });
    }
  },
  // 触摸结束事件
  fTouchEnd: function (e) {
    let _This = this;
    var touchMove = e.changedTouches[0].pageX;
    if (Math.abs(touchMove - touchDotX) > 40) {
      let clist = _This.data.aCurrentList;
      if (clist.length > 1) {
        let rmItem = clist.splice(0, 1);
        _This.setData({
          aCurrentList: clist
        });
      }
    }
    _This.setData({
      itemLeft: "0px",
      itemTop: "20px",
      isShowTip:false
    });
  },
  /**
   * 生成显示的items，direction是切换的方向，大于0是向右，小于0是向左
   */
  fGenerateShow(item, direction) {
    let _This = this;
    let aCaseList = _This.data.aCaseList;
    let aCount = aCaseList.length;
    let iIndex = _This.fFilterData(item);
    let aCurrentList = _This.data.aCurrentList;
    if (direction < 0) {
      aCurrentList = aCaseList.slice(iIndex, iIndex + 2);
    } else {
      if (iIndex > 0) {
        aCurrentList[1] = aCaseList[iIndex - 1];
      }
    }
    _This.setData({
      aCurrentList: aCurrentList
    });
  },
  /**
   * 过滤数据
   */
  fFilterData(id) {
    let _This = this;
    let aCaseList = _This.data.aCaseList;
    let oId = 0;
    aCaseList.some((item, index) => {
      if (item.id == id) {
        oId = index;
        _This.setData({
          currentPage:index+2
        });
      }
    });
    return oId;
  }
/****************滚动事件结束*****************/
})