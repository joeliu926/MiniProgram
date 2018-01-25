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
    aCaseIds: [],//项目案例IDs
    iCurrentSearchCase: 0,//遍历查询案例信息，当前查询的条数
    currentLikeState: false,//当前的是否like
    olikeResult: {},//用户喜欢案例结果
    sCurrentId: 0,//当前案例的id
    oClinic: {},
    oHeight:"",//案例内容的高度
    isFirst:true,//首次进来
    picCount:0,//获取用户上传图片
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
    console.log("ccase------>event", options)

    let _This = this;
    var caseIds = options.caseIds;
    /******** qiehuan*********/
    let aCaseList = _This.data.aCaseList;
    _This.setData({
      aCurrentList: aCaseList.slice(0, 10),
      consultationId: options.consultationId ||options.scene|| "2491",
    });
    /***********qiehuan******/
    getApp().getUserData(function (uinfo) {
      
      _This.fGetShareInfoBySessionId(function(cstInfo){
        _This.setData({
          caseIds: caseIds || "",
          projectName: options.iname||"",
          productCode: cstInfo.productCodes,// options.itemid,
          cstUid: cstInfo.unionId,// options.cstUid || uinfo.unionId,
          oUserInfo: uinfo,
          consultationId: cstInfo.id || "2491",
          likeItem: "",
          shareEventId: options.shareEventId || "",
          oEvent: event.oEvent
        });

        _This.fCustomerAdd();//客户添加
        _This.fGetCaseIDs();//会话ID获取案例ids
        _This.fGetClinicDetail();//获取诊所信息

      });//通过会话id获取咨询师信息



    });
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
    this.fUserEvent(event.eType.appQuit);//授推出事件
  },
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
    let _This=this;
    if (!_This.data.isFirst){
       return false;
    }
    var query = wx.createSelectorQuery().selectAll('.QQQ').boundingClientRect(function (rect) {
      let oHeight=[];
      rect.forEach(item=>{
      oHeight.push(item.height);
    });
    oHeight=oHeight.sort((one,two)=>{
      return one<two;
    });
      _This.setData({
        oHeight: oHeight[0],
        isFirst:false
      });
    }).exec();
  },
  /**
   * 通过会话id获取咨询师分享信息（咨询师id，productcode）
   */
  fGetShareInfoBySessionId(callback){
    let _This = this;
    let pdata = {
      sessionId: _This.data.consultationId
    };
    console.log("post data--->", _This.data.consultationId);
    wxRequest(wxaapi.consult.getconsultinfo.url, pdata).then(function (result) {
      console.log("get unionid by sessionid--->",result);
      if (result.data.code == 0) {
        callback(result.data.data);
      } else {
        console.log("get unionid by sessionid error----", result);
        callback({});
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
    //console.log("---fCustomerAdd---pdata---------->", pdata);
    wxRequest(wxaapi.consult.entry.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
          clueId: result.data.data.clueId
        });
        _This.fUserEvent(event.eType.appOpen);//进入小程序事件
        _This.fGetCustomerByUnionid();
      } else {
        console.log("addcustomer error----", result);
      }
    });
  },
  /**
   * 通过会话id和用户unionid获取客户信息
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
        _This.fGetPhoto();//获取用户上传图片
      } else {
        console.log("get customer info error----", result);
      }
    });
  },
  /**
 * 授权获取手机号码
 */
  getPhoneNumber(e) {
    let _This = this;
    wx.showLoading({
      title: '授权中...',
    });
    let eDetail = e.detail;
    if (!eDetail.encryptedData) {
      wx.hideLoading();
      return false;
    }
    eDetail.times=0;
    _This.fAuthorization(eDetail,function(resPhone){
      if (!resPhone){
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
        oUserInfo: oUserInfo
      });
       wx.hideLoading();
      _This.fUpdateCustomerInfo();
    });
      
    /*  */
  },
  /**
   * 授权后更新客户手机号码
   */
  fUpdateCustomerInfo() {
    let _This = this;
    let oUserInfo = _This.data.oUserInfo;
    let pdata = {
      id: _This.data.oUserInfo.id,
      wechatMobile: _This.data.oUserInfo.wechatMobile
    };
    wxRequest(wxaapi.customer.update.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.fUserEvent(event.eType.authPhone);//授权手机号码事件
        _This.fGetConsultDetail();
      } else {
        console.log("update customer info error----", result);
      }
    });
  },
  /**
   * 用户授权 eDetail用户授权返回对象
   */
  fAuthorization(eDetail,callback){
    let _This=this;
    getApp().fGetSessionKey(false, function (sessionKey) {
        var postData = {
          encryptedData: eDetail.encryptedData,
          sessionKey: sessionKey,
          iv: eDetail.iv
        };
        wxRequest(wxaapi.unionid.userinfo.url, postData).then(resPhone => {
        if (resPhone.data.userinfo) {
          _This.setData({
            agree:1
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


  },
  /**
 * 获取用户上传的图片
 */
  fGetPhoto() {
    let _This = this;
    let postData = {
      customerUnionid: _This.data.oUserInfo.unionId,// 客户unionId
      sessionId: _This.data.consultationId//会话id
    };
    //console.log("postData---fGetPhoto--->", postData);
    wxRequest(wxaapi.consult.getpostphoto.url, postData).then(function (result) {
      //console.log("result--use pic---->", result);
      if (result.data.code == 0) {
        let picCount = _This.data.picCount;
        if (result.data.data.positiveFace){
          picCount++;
        }
        if (result.data.data.sideFace){
          picCount++;
        }
        _This.setData({
          picCount: picCount
        });
      } else {
        console.log("add  event error---", result);
      }
    });
  },
  /**
   * 跳转获取咨询师详情页面
   */
  fGetConsultDetail() {
    let _This = this;
    let cstunionid = _This.data.cstUid;
    wx.navigateTo({
      url: '/pages/client/ccase/counselor/counselor?cstUid=' + cstunionid
    })
  },
  /**
   * 通过会话ID获取所有的案例ID
   */
  fGetCaseIDs() {
    let _This = this;
    let pdata = {
      sessionId: _This.data.consultationId
    };
    wxRequest(wxaapi.consult.sharecase.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        let aCaseIds = result.data.data;
        let aItemLeft = _This.data.aItemLeft || {};
        aCaseIds.forEach((item, index) => {
          let oitem = {
            zindex: 0,
            zleft: 0
          };
          if (index == 0) {
            oitem.zindex = 5;
          } else if (index == 1) {
            oitem.zindex = 4;
          }
          aItemLeft["case" + item] = oitem;
        });
        _This.setData({
          aCaseIds: aCaseIds,
          totalCount: aCaseIds.length,
          aItemLeft: aItemLeft
        });
        _This.fGetCaseDetailById();//获取案例详情
        //_This.fGetLikeState();//获取点赞状态
      } else {
        console.log("case ids error----", result);
      }
    });
  },
  /**
   * 通过案例ID获取案例详情
   */
  fGetCaseDetailById() {
    let _This = this;
    let aCaseIds = _This.data.aCaseIds;
    let iCurrentSearchCase = _This.data.iCurrentSearchCase
    if (iCurrentSearchCase >= aCaseIds.length) {
      return false;
    }
    let currentId = aCaseIds.slice(iCurrentSearchCase, iCurrentSearchCase + 1);
    let pdata = {
      did: aCaseIds[iCurrentSearchCase]
    };
    wxRequest(wxaapi.pcase.detail.url, pdata).then(function (result) {
      // console.log("case detail------->",result);
      if (result.data.code == 0 && typeof (result.data.data) == "object") {
        let oCase = result.data.data;
        let aCaseList = _This.data.aCaseList;
        aCaseList.push(oCase);
        _This.setData({
          oCaseDetail: oCase,
          aCaseList: aCaseList,
          iCurrentSearchCase: iCurrentSearchCase + 1
        });
        if (iCurrentSearchCase == 0) {
          _This.setData({
            aCurrentList: aCaseList
          });
          _This.fGetLikeState();//获取点赞状态
        }
        _This.fGetCaseDetailById();    
      } else {
        console.log("case detail error----", result);
      }
    });
  },
  /**
   * 获取点赞状态
   */
  fGetLikeState() {
    let _This = this;
    let pdata = {
      sessionId: _This.data.consultationId,
      customerUnionid: _This.data.oUserInfo.unionId,
      caseIds: _This.data.aCaseIds
    };
    wxRequest(wxaapi.consult.getsharelike.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
          olikeResult: result.data.data
        });
        _This.fGetCurrentLikeState();
      } else {
        console.log("like state  error----", result);
      }
    });
  },
  /**
   * 当前的点赞状态
   */
  fGetCurrentLikeState() {
    let _This = this;
    let olikeResult = _This.data.olikeResult;
    let aCurrent = _This.data.aCurrentList[0] || {};
    //console.log("aCurrentList------>", _This.data.aCurrentList);
    let currentId = aCurrent.id;
    _This.setData({
      currentLikeState: olikeResult[currentId],
      sCurrentId: currentId
    });
 
  },
  /**
   * 点击喜欢不喜欢案例
   */
  fLikeCase() {
    let _This = this;  //olikeResult
    let olikeResult = _This.data.olikeResult;
    // console.log("like case---", _This.data.sCurrentId,_This.data.currentLikeState); //_This.data.currentLikeState
    _This.fCustomerOperate(1);
    _This.fUserEvent(event.eType.caseLike);
  },
  /**
   * 获取用户操作状态 1喜欢案例 2提交资料
   */
  fCustomerOperate(operateType) {
    let _This = this;
    let pdata = {
      customerUnionid: _This.data.oUserInfo.unionId,
      consultantUnionid: _This.data.cstUid,//咨询师unionid
      sessionId: _This.data.consultationId,//当前会话id
      caseId: _This.data.sCurrentId, //案例id
      operationType: operateType, //1喜欢案例 2提交资料
      positiveFace: "",
      sideFace: ""
    };
    if (_This.data.currentLikeState){
       return false;
    }
    wxRequest(wxaapi.consult.handelsharecase.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        let currentLikeState = _This.data.currentLikeState;
        let olikeResult = _This.data.olikeResult;
        olikeResult[_This.data.sCurrentId] = !currentLikeState;
        _This.setData({
          currentLikeState: true// !currentLikeState
        });
      }
    });
  },
  /**
   * 获取诊所详情信息
   */
  fGetClinicDetail() {
    let _This = this;
    let pdata = {
      unionId: _This.data.cstUid //咨询师unionid
    };
    wxRequest(wxaapi.clinic.detail.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
          oClinic: result.data.data
        });
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

    console.log('_This.data.productCode', _This.data.productCode);
    oTempEvent.shareEventId = _This.data.shareEventId || 1;
    oTempEvent.productCode = [""];
    oTempEvent.clueId = _This.data.clueId; //线索id  
    oTempEvent.leadsId = _This.data.clueId; //线索id新  leadsId
    oTempEvent.consultationId = _This.data.consultationId;//咨询会话ID
    oTempEvent.sceneId = _This.data.consultationId;// 场景sceneId  oUserInfo.
    oTempEvent.eventAttrs = {
      consultantId: _This.data.cstUid,
      clueId:_This.data.clueId, //线索id  
      leadsId: _This.data.clueId, //线索id新  leadsId
      consultationId: _This.data.consultationId,//咨询会话ID
      sceneId:_This.data.consultationId,// 场景sceneId  oUserInfo.
      caseId: _This.data.sCurrentId||"",//
      appletId: "hldn",
      consultingId: _This.data.consultationId,
      isLike: _This.data.isLike||"1",    ////0不喜欢 1喜欢2未选择
      reserveId:"",//
      agree: _This.data.agree,  //1是允许，0是拒绝
      imgNum:"",
      imgUrls: [],
      remark:'',
      triggeredTime:new Date().getTime()
    }
    oTempEvent.subjectAttrs = {
      appid: "yxy",
      consultantId: _This.data.cstUid,
      openid: _This.data.oUserInfo.openId,
      unionid: _This.data.oUserInfo.unionId,
      mobile: _This.data.oUserInfo.wechatMobile||""
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

    console.log('oData', oData);
    wxRequest(wxaapi.event.v2.url, oData).then(function (result) {
      //console.log("000000000000000000000000===>", result);
      if (result.data.code == 0) {

      } else {
        console.log("add  event error---", result);
      }
    });
  },









  /**
   * 跳转至上传图片页面
   */
  fTakePhoto() {
    let _This = this;

    let aCurrent = _This.data.aCurrentList[0] || {};
    //console.log("aCurrentList------>", _This.data.aCurrentList);
    let caseId = aCurrent.id;
    let cstunionid = _This.data.cstUid;
    let consultationId = _This.data.consultationId;//咨询会话ID
    let clueId = _This.data.clueId; //线索id
    let shareEventId = _This.data.shareEventId||""; //分享id
    let tel = _This.data.oUserInfo.wechatMobile || "";//客户idoUserInfo.wechatMobile
    let cid = _This.data.oUserInfo.id;//客户idoUserInfo.wechatMobile
    wx.navigateTo({
      url: '/pages/client/sharecase/tkphoto/tkphoto?consultantId=' + cstunionid + "&consultationId=" + consultationId + "&clueId=" + clueId + "&shareEventId=" + shareEventId + "&caseId=" + caseId + "&tel=" + tel + "&cid=" + cid
    })
  },
  fGetCaseData() {
    let _This = this;
    let caseCount = _This.data.detailInfo.contentList.length || 1;
    let countRate = parseInt(100 / caseCount);
  },
  /**
   * 拨打电话
   */
  fMakePhone() {
    let _This = this;
    wx.makePhoneCall({
      phoneNumber: _This.data.oClinic.phone
    })
  },
  /**
   * 查看诊所map
   */
  fAddressMap() {
    let _This = this;
    let unionId = _This.data.cstUid;
    wx.navigateTo({
      url: './clinicmap/clinicmap?unionId=' + unionId
    })
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
    setTimeout(function(){
      _This.setData({
        isShowTip: false
      });
    },2000);
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