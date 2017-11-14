//const util = require('../../../utils/util.js')
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
   // console.log("+++++++++++++++++++++++++");
   // console.log(options);
   // console.log("+++++++++++++++++++++++++");
    var _This=this;
    var caseIds = options.caseIds;
    getApp().getUserData(function(uinfo){
     // console.log("===========================");
     // console.log(uinfo);

      _This.setData({
        isConsult: caseIds ? false : true,
        caseIds: caseIds || "",
        projectName:options.iname,
        productCode: options.itemid,
        cstUid: uinfo.unionId,
        oUserInfo: uinfo,
        consultationId: options.consultationId||""
      });
      _This.getCaseList(uinfo);
      if (!caseIds||caseIds.length<=0){
        _This.fConsultation(options.itemid, function (result) {
          _This.setData({
            consultationId: result || ""
          });
        });
      };
      _This.fCustomerAdd();
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
      path: '/pages/pcase/citem/citem?caseIds=' + _This.data.caseIds + "&cstUid=" + _This.data.cstUid + "&itemid=" + _This.data.productCode + '&consultationId=' + _This.data.consultationId
    }
  },
  fCaseDetail: function (item) {
    var did=item.target.dataset.uid;
    wx.navigateTo({
      url: '../csdetail/csdetail?did=' + did,
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
         // console.log(result);
          _This.setData({ 
            caseList: result.data.data,
            totalCount: result.data.data.length    
           });
        } else {
          console.log(result);
        }
      }
    });
  },
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
          console.log(result);
        }
      }
    });
  },
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
          console.log(result);
        }
      }
    });
  },
  fUserEvent(){
    let _This = this;
    wx.request({
      url: "https://27478500.qcloud.la/wxa/event/add",
      method: "POST",
      data: {
        code: "case_like", 
        eventAttrs: {
          triggered_time:new Date().valueOf(),
          app: "app",
          consultant: "咨询师union id",
          caseId: "案例id",
          isLike: "是否喜欢（1是 0否 2未知）"

        },
        subjectAttrs: {
          appid: "公众号id",
          openid: "用户openid",
          unionid: "用户unionid",
          手机号码: "mobile"
        }
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
        //console.log("--------------------");
       // console.log(result);
        //console.log("--------------------");
        if (result.data.code == 0) {
          // callback(result.data.data);
        } else {
          console.log(result);
        }
      }
    });
  }
  

})