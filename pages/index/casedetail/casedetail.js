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
    olock: false,
    aCaseList: [],
    isErrorUpload: false,//授权手机号码失败
    aCurrentList: [],//选中项
    itemLeft: 0,//左侧位置
    aItemLeft: {},//左侧位置对象
    caseCount: 4,//案例总数
    itemTop: 20,//顶部位置
    isShowTip: false,//是否显示授权手机号码的tip
    oUserInfo: {}, //当前用户信息
    isEndPage: false,//是否是最后一页
    
    aCaseId: 0,//案例ID
    iCurrentSearchCase: 0,//遍历查询案例信息，当前查询的条数
    currentLikeState: false,//当前的是否like
    olikeResult: {},//用户喜欢案例结果
    sCurrentId: 0,//当前案例的id
    oClinic: {},
    oHeight: "",//案例内容的高度
    isFirst: true,//首次进来
    picCount: 0,//获取用户上传图片
    clueId: "",
    currentPage: 0,
    totalCount: 1,
    caseList: [],
    detailInfo: {
      "doctorName": "",
      "contentList": [
        {
          "title": "",
          "description": "",
          "definitionDate": "",
          "pictures": []
        }
      ]
    },
    oCaseDetail: {
      "id": "",
      "caseName": "",
      "doctor": {
      },
      "products": [
      ],
      "operationDate": "",
      "customerGender": "",
      "customerAge": "",
      "customerLogo": {
      },
      "beforePicture": {
      },
      "afterPicture": {
      },
      "contentList": [
      ]
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This = this;
    var caseId = Number(options.caseid);
   
    /******** qiehuan*********/
    // let aCaseList = _This.data.aCaseList;
    // _This.setData({
    //   aCurrentList: aCaseList.slice(0, 10)
    // });
    // console.log("get user info-------------");
    /***********qiehuan******/
    getApp().getUserData(function (uinfo) {
      //console.log("---ccase----user info=====>", uinfo);
      _This.setData({
        aCaseId: caseId || "",
        projectName: options.iname,
        productCode: options.itemid,
        cstUid: options.cstUid || uinfo.unionId,
        oUserInfo: uinfo,
        consultationId: options.consultationId || "1616",
        likeItem: "",
        shareEventId: options.shareEventId || "",
        oEvent: event.oEvent
      });

      // _This.fCustomerAdd();//客户添加
      // _This.fGetCaseIDs();//会话ID获取案例ids
      _This.fGetCaseDetailById()//获取案例

    });
  },
  /**
 * 通过案例ID获取案例详情
 */
  fGetCaseDetailById() {
    let _This = this;
    let aCaseId = _This.data.aCaseId;
    let iCurrentSearchCase = _This.data.iCurrentSearchCase;
    // if (iCurrentSearchCase >= aCaseIds.length) {
    //   return false;
    // }
    // let currentId = aCaseIds.slice(iCurrentSearchCase, iCurrentSearchCase + 1);[iCurrentSearchCase]
    let pdata = {
      did: aCaseId
    };
    wxRequest(wxaapi.pcase.detail.url, pdata).then(function (result) {
      console.log("casedetail=========00000000000000------->",result);
      if (result.data.code == 0 && typeof (result.data.data) == "object") {
        let oCase = result.data.data;
        let aCaseList = _This.data.aCaseList;

        _This.setData({
          oCaseDetail: oCase,
          aCaseList: aCaseList,

        });


        
      } else {
        console.log("case detail error----", result);
      }
    });
  },


/**
 *点击图片查看预览 
 */  
  imgPreview(e) {
    var dataset = e.currentTarget.dataset;
    wx.previewImage({
      current: dataset.src,
      urls: [dataset.src]
    })
  },
  onReady: function () {
  },
  /**
   * 获取案例列表的内容高度
   */
  fGetView() {
    let _This = this;
    if (!_This.data.isFirst) {
      return false;
    }
    var query = wx.createSelectorQuery().selectAll('.QQQ').boundingClientRect(function (rect) {
      let oHeight = [];
      rect.forEach(item => {
        oHeight.push(item.height);
      });
      oHeight = oHeight.sort((one, two) => {
        return one < two;
      });
      _This.setData({
        oHeight: oHeight[0],
        isFirst: false
      });
    }).exec();
  },
  /**
   * 客户添加或者更新,返回线索id
   */
  // fCustomerAdd() {
  //   let _This = this;
  //   let pdata = {
  //     openid: _This.data.oUserInfo.openId,
  //     wxNickname: _This.data.oUserInfo.nickName,
  //     gender: _This.data.oUserInfo.gender,
  //     province: _This.data.oUserInfo.province,
  //     city: _This.data.oUserInfo.city,
  //     country: _This.data.oUserInfo.country,
  //     logo: _This.data.oUserInfo.avatarUrl,
  //     unionid: _This.data.oUserInfo.unionId,
  //     userUnionid: _This.data.cstUid,
  //     consultationId: _This.data.consultationId
  //   };
  //   //console.log("---fCustomerAdd---pdata---------->", pdata);
  //   wxRequest(wxaapi.consult.entry.url, pdata).then(function (result) {
  //     if (result.data.code == 0) {
  //       _This.setData({
  //         clueId: result.data.data.clueId
  //       });
  //       _This.fUserEvent(event.eType.appOpen);//进入小程序事件
  //       _This.fGetCustomerByUnionid();
  //     } else {
  //       console.log("addcustomer error----", result);
  //     }
  //   });
  // },
  /**
   * 通过会话id和用户unionid获取客户信息
   */
  // fGetCustomerByUnionid() {
  //   let _This = this;
  //   let oUserInfo = _This.data.oUserInfo;
  //   let pdata = {
  //     consultantUnionid: _This.data.cstUid,
  //     unionid: _This.data.oUserInfo.unionId
  //   };
  //   wxRequest(wxaapi.customer.getcustomerbyunid.url, pdata).then(function (result) {
  //     //console.log("get customer info result---->", result);
  //     if (result.data.code == 0) {
  //       oUserInfo.wechatMobile = result.data.data.wechatMobile;
  //       oUserInfo.id = result.data.data.id;
  //       _This.setData({
  //         oUserInfo: oUserInfo
  //       });
  //       _This.fGetPhoto();//获取用户上传图片
  //     } else {
  //       console.log("get customer info error----", result);
  //     }
  //   });
  // },


 

 




  /*
 *事件参数 
 */
  fGetTempEvent() {
    var _This = this;
    var oTempEvent = _This.data.oEvent;
    var currentPage = _This.data.currentPage;
    oTempEvent.shareEventId = _This.data.shareEventId || 1;
    oTempEvent.productCode = _This.data.productCode;
    oTempEvent.clueId = _This.data.clueId; //线索id
    oTempEvent.consultationId = _This.data.consultationId;//咨询会话ID
    oTempEvent.eventAttrs = {
      consultantId: _This.data.cstUid,
      //caseId: _This.data.caseList[currentPage - 1].id,//
      caseId: 3,//
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
      if (result.data.code == 0) {
      } else {
        console.log("add  event error---", result);
      }
    });
  },












  /*************** 滚动事件 开始************************/
  // 触摸开始事件
  fTouchStart: function (e) {
    //console.log("e.touches[0]------->", e, e.currentTarget);
    this.fGetView();
    let caseItem = e.currentTarget.dataset.caseitem;
    this.setData({
      currentItem: caseItem,
      // isShowTip:true
    });
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点touchDotX
    touchDotY = e.touches[0].pageY; // 获取触摸时的原点touchDotY
  },
  fTouchMove: function (e) {
    //console.log("e.touches[0]------->", e.touches[0]);
    let _This = this;
    let tX = (e.touches[0].pageX - touchDotX);
    let tY = (e.touches[0].pageY - touchDotY);
    let currentItemId = _This.data.currentItem;//当前的案例id
    let iIndex = _This.fFilterData(currentItemId);
    if (iIndex <= 0 && tX > 0) {
      return false;
    }

    let olock = _This.data.olock;
    if (Math.abs(tX) > Math.abs(tY) + 40) {
      if (!olock) {
        _This.setData({
          olock: true
        });
        _This.fGenerateShow(currentItemId, tX);
      }
      if ((iIndex + 1) == _This.data.totalCount && tX < 0) {
        _This.setData({
          isEndPage: true
        });
      }
    } else {
      _This.setData({
        olock: false
      });
    }



    //if (Math.abs(tY) < Math.abs(tX)) {
    if (Math.abs(tX) > Math.abs(tY) + 60) {
      let aItemLeft = _This.data.aItemLeft;
      aItemLeft["case" + currentItemId].zleft = tX + "px";
      _This.setData({
        aItemLeft: aItemLeft
      });
    } else {
      this.setData({
        isShowTip: true
      });
    }
  },
  // 触摸结束事件
  fTouchEnd: function (e) {
    let _This = this;
    let touchMove = e.changedTouches[0].pageX;
    let tX = (e.changedTouches[0].pageX - touchDotX);
    let tY = (e.changedTouches[0].pageY - touchDotY);
    let currentItemId = _This.data.currentItem;//当前的案例id
    if (Math.abs(touchMove - touchDotX) > 100 && (Math.abs(tX) > Math.abs(tY) + 60)) {
      let clist = _This.data.aCurrentList;
      if (clist.length > 1) {
        let rmItem = clist.splice(0, 1);
        _This.setData({
          aCurrentList: clist
        });
        _This.fFilterData(clist[0].id);
      }
      wx.pageScrollTo({
        scrollTop: 0
      })
    }

    ///////////////////////////////////////////
    let aCurrentList = _This.data.aCurrentList;
    let aCurrentOne = aCurrentList[0];
    let aItemLeft = _This.data.aItemLeft;
    aItemLeft["case" + currentItemId] = { zleft: 0, zindex: 1 };
    ///////////////////////////////////////////
    aItemLeft["case" + aCurrentOne.id] = { zindex: 5 };
    _This.setData({
      aItemLeft: aItemLeft,
      itemLeft: "0px",
      itemTop: "20px"
    });
    setTimeout(function () {
      _This.setData({
        isShowTip: false
      });
    }, 2000);
    /////////////////////////////////////////////
    _This.fGetCurrentLikeState();
  },
  /**
   * 生成显示的items，direction是切换的方向，大于0是向右滑动查看左侧，小于0是向左滑动查看右侧
   */
  fGenerateShow(itemid, direction) {
    let _This = this;
    let aCaseList = _This.data.aCaseList;
    let aCount = aCaseList.length;
    let iIndex = _This.fFilterData(itemid);
    let aCurrentList = _This.data.aCurrentList;
    if (direction < 0) {
      aCurrentList = aCaseList.slice(iIndex, iIndex + 2);
    } else {
      if (iIndex > 0) {
        aCurrentList[1] = aCaseList[iIndex - 1];
      }
    }
    let aCurrentTwo = aCurrentList[1] || { id: 0 };
    let aItemLeft = _This.data.aItemLeft;
    aItemLeft["case" + aCurrentTwo.id] = { zindex: 4 };
    _This.setData({
      aItemLeft: aItemLeft,
      aCurrentList: aCurrentList
    });
  },
  /**
   * 过滤数据，返回当前的案例的id
   */
  fFilterData(id) {
    let _This = this;
    // return false;
    let aCaseList = _This.data.aCaseList;
    let oId = 0;
    aCaseList.some((item, index) => {

      if (item.id == id) {
        //console.log("index------->", index, _This.data.currentPage, "-----item.id----", item.id,"id-------",id);
        oId = index;
        _This.setData({
          currentPage: index
        });
      }
    });
    return oId;
  },
  /****************滚动事件结束*****************/
  /**
   * 诊所详情页面触摸start
   */
  fEndPageStart(e) {
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点touchDotX
    touchDotY = e.touches[0].pageY; // 获取触摸时的原点touchDotY
  },
  /**
   * 诊所详情页面触摸end
   */
  fEndPageEnd(e) {
    let _This = this;
    let currentPage = _This.data.currentPage;//当前页
    let totalCount = _This.data.totalCount;//总页数
    let touchMove = e.changedTouches[0].pageX;
    if (touchMove - touchDotX > 50) {
      _This.setData({
        isEndPage: false
      });
    }
  }

})