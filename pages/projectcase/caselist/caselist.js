const event = require('../../../public/js/wxEvent.js');
const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isAddShare:false,//是否加入分享
    isShare:false,//是否分享
    shareType: 3,//分享类型  1朋友圈 2分享到群 3分享到好友
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
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 500,
    isConsult: true,
    // 弹层
    uicondata: "",
    oUserInfo: {},
    consultationId: "",
    itemids: [],
    jSelect: "",
    isactive: false,
    ishow: false,
    projectItems: [],
    sSelect: [],
    arrData: [],
    cases: [],
    changeColor: "#999999",
    productlistArr: [],
    selable: [],
    allarr: [],
    isShow: 'false',
    current: 0,
    productcodes: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _This = this;
    var itemids = options.itemids.split(",");
    var caseIds = options.caseIds;
    getApp().getUserData(function (uinfo) {
      _This.setData({
        isConsult: caseIds ? false : true,
        caseIds: caseIds || "",
        projectName: options.iname,
        productCode: options.itemid,
        cstUid: uinfo.unionId,
        oUserInfo: uinfo,
        consultationId: options.consultationId || "",
        likeItem: "",
        shareEventId: options.shareEventId || "",
        oEvent: event.oEvent,
        arrData: JSON.parse(options.pdata),//从上一个页面跳转的数据 初始化数据
        itemids: options.itemids.split(","),
        sSelect: itemids,
      });
      _This.fGetCaseList(uinfo);//获取案例
    });
    //设置第一个项目是选中的；
    this.data.arrData[0].changeColor = '#9083ed';
    this.setData({
      arrData: this.data.arrData
    });
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    })
  },
  /*
   *事件参数 
   */
  fGetTempEvent() {
    var _This = this;
    var oTempEvent = _This.data.oEvent;
    var currentPage = _This.data.currentPage;
    oTempEvent.shareEventId = _This.data.shareEventId;
    oTempEvent.productCode =[""];
    oTempEvent.consultationId=_This.data.consultationId,
    oTempEvent.sceneId = _This.data.consultationId;
    oTempEvent.eventAttrs = {
      consultantId: _This.data.cstUid,
      caseId: _This.data.caseList[currentPage-1].id,
      appletId: "hldn",
      consultingId: _This.data.consultationId,
      isLike: _This.data.isLike||"",
      clueId: "",//无
      reserveId: "",//无
      sceneId: _This.data.consultationId,
      agree: "",
      unionid: _This.data.oUserInfo.unionId,
      openid: _This.data.oUserInfo.openId,
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
   * 用户点击右上角分享   分享给好友
   */
  onShareAppMessage: function (e) {
    let _This = this;
    if (!_This.data.consultationId) {
      /// callback(_This.data.consultationId);
      return false;
    }

    let prodcutcodearr = _This.data.productcodes;
    this.data.caseList.forEach(function (item) {
      if (_This.data.aCaseIds.indexOf(item.id) != -1) {
        item.products.forEach(item => {
          if (prodcutcodearr.indexOf(item.productCode) == -1) {
            prodcutcodearr.push(item.productCode);
          }

        });
      }
    })
    prodcutcodearr = prodcutcodearr.filter(function (pitem, pindex, oProduct) {
      return oProduct.indexOf(pitem) == pindex;
    })
    _This.setData({
      productcodes: prodcutcodearr
    })
    var caseIds = _This.data.caseIds;
    var currentPage = _This.data.currentPage;
    if (caseIds == "") {
      caseIds = _This.data.caseList[currentPage - 1].id;
    }
 
    return {
      title: '案例分享',
      path: '/pages/client/ccase/ccase?caseIds=' + caseIds + "&cstUid=" + _This.data.cstUid + "&itemid=" + _This.data.productCode + '&consultationId=' + _This.data.consultationId + '&shareEventId=' + _This.data.shareEventId,
      success: function (res) {
        console.log("share result------->",res);
        let sType =3;
        if (res.shareTickets){
          sType=2;
        }
        _This.setData({
          shareType: sType,
          isShare: false
        }); 

        console.log(' _This.fUpdateShare()')
        _This.fUpdateShare();
        wx.redirectTo({
          url: '../../index/home?type=share',
        })
        /*wx.navigateTo({
          url: '../../index/home?type=share'
        })*/
      }
    } 
  },
  /**
   * 用户分享以后更新分享内容
   */
  fUpdateShare(){
    let _This=this;
    let shareData = {
      cases: _This.data.aCaseIds,//案例列表Id
      consultingId: _This.data.consultationId,//会话id
      consultantUnionid: _This.data.oUserInfo.unionId,//咨询师unionid
      products: _This.data.productcodes,//项目列表id  [3002,3025,3028]
      type: _This.data.shareType // 
    };

    console.log('shareData', shareData);
    wxRequest(wxaapi.consult.consultantupdate.url, shareData).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({ projectItems: result.data.data });
        _This.fUserEvent(event.eType.appShare);
      } else {
        console.log(result);
      }
      wx.hideLoading();
    });
  },
  /**
   * 案例详情
   */
  fCaseDetail: function (item) {
    var _This = this;
    var did = item.target.dataset.uid;
    wx.navigateTo({
      url: '../casedetail/casedetail?did=' + did + "&cstUid=" + _This.data.cstUid + '&consultationId=' + _This.data.consultationId + '&shareEventId=' + _This.data.shareEventId
    })
  },
  /**
   * 咨询师改变分享的条目  加入分享
   */
  fChangeShare(e) {

    let _This=this;
    if (!_This.data.isAddShare){
      _This.fGetConsultationId(_This.data.itemids.join(","), function (result) {
        _This.setData({
          consultationId: result || "",
          isAddShare:true
        });
    
      });
    }
    var prodcutcodearr = this.data.productcodes;
    var citem = e.currentTarget.dataset.itemid;
    var cindex = e.currentTarget.dataset.indexi;
    var tmpList = this.data.caseList;
    var oItems = this.data.aCaseIds;
    var dindex = oItems.indexOf(citem);
    this.data.caseList.forEach(function (item) {
      if (item.id == citem) {
        item.products.forEach(item => {
          if (prodcutcodearr.indexOf(item.productCode) == -1) {
            prodcutcodearr.push(item.productCode);
          } else {
            prodcutcodearr.splice(prodcutcodearr.indexOf(item.productCode), 1);
          }

        });
      }
    })
    prodcutcodearr = prodcutcodearr.filter(function (pitem, pindex, oProduct) { 
      return oProduct.indexOf(pitem) == pindex;
    })

    if (dindex < 0) {
      oItems.push(citem);
      tmpList[cindex]["current"] = citem;
    } else {
      tmpList[cindex]["current"] = -1;
      oItems.splice(dindex, 1);
    }
    this.setData({
      productcodes: prodcutcodearr,
      aCaseIds: oItems,
      caseList: tmpList,
      caseIds: oItems.toString(),
      likeItem: oItems.toString()
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
   * 获取会话ID，咨询师获取会话ID进行消息分享
   */
  fGetConsultationId(sItem, callback) {
    let _This = this;
    if (_This.data.consultationId) {
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
      consultType:1
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
  fUserEvent(eType) {
    let _This = this;
    _This.fGetTempEvent();
    var oData = _This.data.oEvent;
    oData.eventAttrs.triggeredTime = new Date().valueOf();
    oData.code = eType;

    console.log('oData', oData);
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
  /**
   *  根据传递的项目的productcode 获取案例列表  
   */
  fGetCaseList(uinfo) {
    let _This = this;
    var pdata = {
      unionid: uinfo.unionId,
      productCodes: _This.data.itemids || [],
      // caseIds: _This.data.caseIds
    };
    wxRequest(wxaapi.pcase.morelist.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
          caseList: result.data.data,
          totalCount: result.data.data.length
        });
        // console.log("case list----", _This.data.caseList);
      } else {
        console.log("case list----", result);
      }
    });
  },
  /**
   * 下拉选择 获取项目列表
   */
  getproductitem() {
    let _This = this;

    if (this.data.itemids.length > 0) {
      _This.setData({
        isConsult: false,
        isactive: true
      })
    }
    //全部的项目================
    let pdata = { unionId: _This.data.oUserInfo.unionId };//,all:0
    wxRequest(wxaapi.product.list.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        // 没有案例的项目不可用
        var everyarr = [];
        result.data.data.forEach(function (item) {
          item.productList.forEach(function (oitem) {
            oitem.productList.forEach(function (titem) {
              // console.log(titem.productCode);
              everyarr.push(titem.productCode);
            })
          })
        })
        _This.setData({
          projectItems: result.data.data,
          allarr: everyarr,
          ishow: !_This.data.ishow,
          isactive: _This.data.isactive,
        });
      } else {
        console.log(result);
      }
      wx.hideLoading();
    });

    //可选的项目
    let abledata = { unionId: _This.data.oUserInfo.unionId, all: 0 };//,all:0
    wxRequest(wxaapi.product.list.url, abledata).then(function (result) {
      // console.log("3333333333333333333===>", result.data.data);
      var codearr = [];
      if (result.data.code == 0) {
        result.data.data.forEach(function (item) {
          item.productList.forEach(function (oitem) {
            oitem.productList.forEach(function (titem) {
              // console.log(titem.productCode);
              codearr.push(titem.productCode);

            })
          })
        })
        _This.setData({
          // projectItems: result.data.data,
          selable: codearr
        });
      } else {
        console.log(result);
      }
      wx.hideLoading();
    });
  },
  /**
   *选择项目切换样式 （顶部）
   * 
   */
  chooseitem(e) {
    var _This = this;
    var targetproductcode = e.target.dataset.itemid;
    // 对应的案例选中
    this.data.caseList.forEach(function (oitem, index) {
      oitem.products.forEach(function (item, k) {
        // console.log(item);
        if (item.productCode == targetproductcode) {  
          _This.setData({
            current: index
          })
        }
      })
    })
    // 选择对应的项目  添加选中的样式
    for (let i = 0; i < this.data.arrData.length; i++) {
      if (e.target.dataset.itemid == this.data.arrData[i].itemid) {

        this.data.arrData[i].changeColor = '#9083ed';
        this.setData({
          arrData: this.data.arrData
        })
      } else {
        this.data.arrData[i].changeColor = "#000000";
        this.setData({
          arrData: this.data.arrData
        })
      }
    }

  },
  // 下拉的项目列表中选中
  selectItem(item) {
    let _This = this;
    let sItem = item.target.dataset;
    // 不可选
    clearTimeout(timer);
    if (this.data.selable.indexOf(sItem.itemid) == -1) {
      this.setData({
        isShow: 'true',

      });
      var timer = setTimeout(function () {
        _This.setData({
          isShow: 'false'
        });
      }, 2000);
      // clearTimeout(timer);
    } else {
      var arr = this.data.sSelect;
      var arrData = this.data.arrData;
      // console.log(arr.indexOf(sItem.itemid));
      if (arr.indexOf(sItem.itemid) == -1) {
        arr.push(sItem.itemid);
        arrData.push(sItem);
        // console.log(arrData);
      } else {
        var index = arr.indexOf(sItem.itemid);
        if (index > -1) {
          arr.splice(index, 1);
          arrData.splice(index, 1);
          // console.log(arrData);
        }
      }
      this.setData({
        sSelect: arr,
        arrData: this.data.arrData,
        itemids: this.data.sSelect,
        isactive: _This.data.sSelect.length > 0 ? true : false
      });
      // 传递相关的参数到借口
    }
    this.setData({
      jSelect: sItem.itemid,
    });

  }
  ,
  /**
   *在 下拉中的项目列表选好项目并更新项目的案例 
   */
  selectItems() {
    // 选好项目从新请求案例列表
    let _This = this;
    if (this.data.itemids.length <= 0) {
      return false;
    }
    var pdata = {
      unionid: _This.data.oUserInfo.unionId,
      productCodes: _This.data.itemids || [],
      // caseIds: _This.data.caseIds
    };
    wxRequest(wxaapi.pcase.morelist.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
          caseList: result.data.data,
          totalCount: result.data.data.length,
          ishow: !_This.data.ishow,
          arrData: _This.data.arrData,
          itemids: _This.data.sSelect,
        });
      } else {
        //console.log("case list----", result);
      }
    });

    //设置第一个项目是选中的；
    this.data.arrData[0].changeColor = '#9083ed';
    this.setData({
      arrData: this.data.arrData,
      isConsult: !_This.data.isConsult,
    })
  },
  /**
   * 生成海报
   */
  fGeneratePost(){
    let _This=this;
    let caseIds = _This.data.caseIds||"";
    let cstUid = _This.data.cstUid;
    let itemid = _This.data.productCode||"";
    let consultationId = _This.data.consultationId;
    let shareEventId = _This.data.shareEventId;
    _This.setData({
      isShare: false,
      shareType: 1
    });
    _This.fUpdateShare();
    wx.navigateTo({
      url: `/pages/projectcase/post/post?caseIds=${caseIds}&cstUid=${cstUid}&itemid=${itemid}&consultationId=${consultationId}&shareEventId=${shareEventId}`,
    })
  },
  /**
   * 加入分享
   */
  fAddToShare(){
    let _This = this;
    _This.setData({
      isShare: true
    });
  },
  /**
   * 取消分享
   */
  fCancelShare(){
    let _This=this;
    _This.setData({
      isShare:false
    });
  }
})