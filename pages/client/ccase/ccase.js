const wxaapi = require('./../../../public/wxaapi.js');
const wxRequest = require('./../../../utils/js/wxRequest.js');
const wxPromise = require('./../../../utils/js/wxPromise.js');

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
    caseCount:4,
    itemTop: 20,//顶部位置

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
  let _This=this;
 // _This.fGetCaseData();

/******** qiehuan*********/
  let aCaseList = _This.data.aCaseList;
  _This.setData({
    aCurrentList: aCaseList.slice(0, 10)
  });
/***********qiehuan******/
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("-----selectorQuery-----");
    let _This=this;

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  fCloseMask(){
   this.setData({
     isFirstEnter:false
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
      currentItem: caseItem
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
      itemTop: "20px"
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