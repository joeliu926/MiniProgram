//const util = require('../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    caseList: [
      {
        "id": 1,
        "doctorName": "刘德华",
        "customerLogo": "http://101.132.161.222:8077/mc_files/10088/CASE_LIBRARY/8cd0f341-fd25-4774-aa09-83daa49aa23d",
        "customerName": "吴彦祖",
        "caseName": "我要隆个鼻",
        "productName": "你猜",
        "frondFile": "http://101.132.161.222:8077/mc_files/10088/CASE_LIBRARY/8cd0f341-fd25-4774-aa09-83daa49aa23d",
        "backFile": "http://101.132.161.222:8077/mc_files/10088/CASE_LIBRARY/8cd0f341-fd25-4774-aa09-83daa49aa23d"
      }
    ],
    caseIds:"",
    aCaseIds:[],
    currentPage:1,
    totalCount:0,
    cstUid:"",
    productCode:"",
    projectName:"",

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
    //console.log(util.formatTime(1510724649000))

    //console.log(options);
    var _This=this;
    var caseIds = options.caseIds;
    //console.log("caseIds----",caseIds);

    getApp().getUserData(function(uinfo){
      //console.log(uinfo);
      _This.setData({
        isConsult: caseIds ? false : true,
        caseIds: caseIds || "",
        projectName:options.iname,
        productCode: options.itemid,
        cstUid: uinfo.unionId
      });
      _This.getCaseList(uinfo);

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /* wx.setNavigationBarTitle({
       title:"This is a title"
     })*/
     //console.log("-----------+++++++++---------");
     //console.log(getApp().globalData.userInfo)
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
    //console.log("ffff");
    var _This=this;
    return {
      title: '案例分享',
      path: '/pages/pcase/citem/citem?caseIds=' + _This.data.caseIds + "&cstUid" + _This.data.cstUid + "&prodcutCode=" + _This.data.productCode
    }
  },
  fCaseDetail: function (item) {
    //console.log(item.target.dataset.uid);
    wx.navigateTo({
      url: '../csdetail/csdetail',
    })
  },
  fLikeCase: function () {
    wx.navigateTo({
      url: '/pages/pcase/tkphoto/tkphoto',
    })
  },
  fUnlikeCase: function () {

  },
  fShareMessage: function () {
    console.log("show share");
 
    wx.showShareMenu({
      withShareTicket: true
    });
  },
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
      caseIds: oItems.toString()
    });
  },
  fSwiperChange:function(e){
    this.setData({currentPage:e.detail.current+1});
  },
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
          console.log(result);
          _This.setData({ 
            caseList: result.data.data      
           });
        } else {
          console.log(result);
        }
      }
    });
  }
})