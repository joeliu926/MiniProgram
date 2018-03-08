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
    // 弹层
    uicondata: "",
    oUserInfo: {},
    consultationId: "",
    projectItems: [],
    sSelect: ["0"],//选中的productcode
    aSelectObj: [{ iname: "全部项目", itemid: "0" }],//选中的product obj
    cases: [],
    changeColor: "#999999",
    productlistArr: [],
    selable: [],
    isShow: 'false',  //显示无案例提示框
    isSelectProduct:false,//before是否打开选择项目下拉
    productcodes: [],
    isSelectDropProduct:true,//new是否下拉选择项目列表
    oProductCollection:[],//下拉项目集合
    isCurrentCate:"",//当前选中的分类
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _This = this;
   // var sSelect =[];// options.itemids.split(",");//获取前一个页面的选中项目Code
    getApp().getUserData(function (uinfo) {
      _This.setData({
        caseIds: "",
        projectName: options.iname,
        productCode: options.itemid,
        cstUid: uinfo.unionId,
        oUserInfo: uinfo,
        consultationId: options.consultationId || "",
        likeItem: "",
        shareEventId: options.shareEventId || "",
        oEvent: event.oEvent,
       // aSelectObj: JSON.parse(options.pdata),//从上一个页面跳转的数据 初始化数据
       // sSelect: sSelect,
      });
      _This.fGetCaseList(uinfo);//获取案例
      _This.fGetDropdownProductList();//获取下拉选项的项目列表
    });
    //设置第一个项目是选中的；
   /* this.data.aSelectObj[0].changeColor = '#9083ed';
    this.setData({
      aSelectObj: this.data.aSelectObj
    });*/
    wx.showShareMenu({
      withShareTicket: true //要求小程序返回分享目标信息
    });
    wx.hideShareMenu();
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

        _This.fUpdateShare();
        wx.redirectTo({
          url: '../../index/home?type=share',
        })
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

    //console.log('shareData', shareData);
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
   /* wx.navigateTo({
      url: '../casedetail/casedetail?did=' + did + "&cstUid=" + _This.data.cstUid + '&consultationId=' + _This.data.consultationId + '&shareEventId=' + _This.data.shareEventId
    })*/
    wx.navigateTo({
      url: `/pages/index/casedetail/casedetail?caseid=${did}`
    })
  },
  /**
   * 咨询师改变分享的条目  加入分享
   */
  fChangeShare(e) {

    let _This=this;
    if (!_This.data.isAddShare){
      _This.fGetConsultationId(_This.data.sSelect.join(","), function (result) {
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
      //productCodes: _This.data.sSelect || [],
      productCodes: [],
    };
    wxRequest(wxaapi.pcase.morelist.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
          caseList: result.data.data,
          totalCount: result.data.data.length
        });
         console.log("case list----", _This.data.caseList);
      } else {
        console.log("case list----", result);
      }
    });
  },
  /**
   * 获取下拉选项项目列表
   */
  fGetDropdownProductList(){
    let _This = this;
    //全部的项目================all:0是所有有案例的项目
    let pdata = { unionId: _This.data.oUserInfo.unionId };//,all:0
    wxRequest(wxaapi.product.list.url, pdata).then(function (result) {
     
      if (result.data.code == 0) {
        let oCate=result.data.data;
        oCate.unshift({productCode: 0,productName: "全部项目",productList:[]});
        _This.setData({
          projectItems: oCate,
          //isCurrentCate: isCurrentCate
        });
        //console.log("get product list 所有 all--------", oCate);
        _This.fChooseProduct();
        //可选的项目
        let abledata = { unionId: _This.data.oUserInfo.unionId, all: 0 };//,all:0
        return wxRequest(wxaapi.product.list.url, abledata);
      } else {
        return {data:{}};
      }
    }).then(function (result) {
      //console.log("get product list result all=0--------", result);
      var codearr = ["0"];
      if (result.data.code == 0) {
        result.data.data.forEach(function (item) {
          item.productList.forEach(function (oitem) {
            oitem.productList.forEach(function (titem) {
              codearr.push(titem.productCode);
            });
          });
        });
        _This.setData({
          selable: codearr
        });
      } else {
        console.log(result);
      }
    });
  },
  /**
   * 下拉选择 获取项目列表
   */
  fGetproductItem() {
    let _This = this;
      _This.setData({
      //  isSelectProduct:true,
        isSelectDropProduct:true//
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
    for (let i = 0; i < this.data.aSelectObj.length; i++) {
      if (e.target.dataset.itemid == this.data.aSelectObj[i].itemid) {

        this.data.aSelectObj[i].changeColor = '#9083ed'// '#9083ed';
        this.setData({
          aSelectObj: this.data.aSelectObj
        })
      } else {
        this.data.aSelectObj[i].changeColor = "#333333";
        this.setData({
          aSelectObj: this.data.aSelectObj
        })
      }
    }

  },
  // 下拉的项目列表中选中
  fSelectItem(item) {
    let _This = this;
    let sItem = item.target.dataset;
    // 不可选
    if (this.data.selable.indexOf(sItem.itemid)<0) {
      _This.setData({
        isShow: 'true',
      });
      var timer = setTimeout(function () {
        _This.setData({
          isShow: 'false'
        });
      }, 2000);
    } else {
      let sSelect = this.data.sSelect;
      let aSelectObj = this.data.aSelectObj;
      if (sItem.itemid == 0) {
        this.setData({
          sSelect: ["0"],
          aSelectObj: [{iname: "全部项目", itemid: "0" }]
        });
        return false;
      }else{
        if (sSelect.indexOf("0")>=0){
          sSelect.splice(0, 1);
          aSelectObj.splice(0, 1); 
        }
      }
      let index = sSelect.indexOf(sItem.itemid);
      if (index<0) {
        sSelect.push(sItem.itemid);
        aSelectObj.push(sItem);
      } else {   
          sSelect.splice(index, 1);
          aSelectObj.splice(index, 1);    
      }
      this.setData({
        sSelect: sSelect,
        aSelectObj: aSelectObj
      });
    }
  }
  ,
  /**
   *在 下拉中的项目列表选好项目并更新项目的案例 
   */
  selectItems() {
    // 选好项目从新请求案例列表
    let _This = this;
    let sSelect = _This.data.sSelect;
    if (sSelect.length <= 0) {
      return false;
    }
    var pdata = {
      unionid: _This.data.oUserInfo.unionId,
      productCodes: sSelect,
    };
    if (sSelect.indexOf("0")>=0){
      pdata.productCodes =[];
    }
    wxRequest(wxaapi.pcase.morelist.url, pdata).then(function (result) {
      console.log("-----------------eee---",result);
      if (result.data.code == 0) {
        _This.setData({
          caseList: result.data.data,
          totalCount: result.data.data.length,
          isSelectDropProduct:false,
        });
      } else {
        console.log("case list----", result);
      }
    });
    //设置第一个项目是选中的；
    let aSelectObj=_This.data.aSelectObj;
    aSelectObj[0].changeColor = '#9083ed';
    this.setData({
      aSelectObj:aSelectObj,
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
    //console.log("_This.data.aCaseIds----------",_This.data.aCaseIds);
    if (_This.data.aCaseIds.length<=0){
      return false;
    }
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
  },
  /**
   * 通关分类选择项目
   */
  fChooseProduct(e){
    let _This=this;
    let projectItems=_This.data.projectItems;
 
    if (projectItems.length<=0){
      return false;
    }
    let products = e?e.target.dataset.products:projectItems[0].productList;
    let isCurrentCate =e?e.target.dataset.pcode:projectItems[0].productCode;

   

    let oProductCollection=[];
    products.forEach((oItem,oIndex)=>{
      oItem.productList.forEach((item,index)=>{
        oProductCollection.push(item);
      });
    });
    if(isCurrentCate==0){
      oProductCollection = [{ productName: "全部项目", productCode:"0"}];
    }
    _This.setData({
      oProductCollection: oProductCollection,
      isCurrentCate: isCurrentCate
    });
  }
})