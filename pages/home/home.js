const wxaapi = require('../../public/wxaapi.js');
const wxRequest = require('../../utils/js/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showicon: false,
    phonenum: "",
    customerList:[],
    oUInfo:{},
    showData:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     if(options.init){
      // getApp().globalData.flag=false; 
     }
    var _This = this;
    getApp().getUserData(function (result) {
      console.log("loading use info=====>",result);
      _This.fGetCUserInfo(result.unionId);
      _This.setData({
        oUInfo: result
      });
      _This.getProjectList();
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /*if (getApp().globalData.flag) {
      wx.navigateBack({
        delta: 1
      })
      getApp().globalData.flag = false;
      wx.navigateBack({
        delta: 1
      })
    } */
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu({});
    wx.hideNavigationBarLoading();
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
    //wx.reLaunch();
    this.getProjectList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
   //console.log("this is bottom data");
   wx.showLoading({
     title: 'loading...',
   });
   setTimeout(function(){
     wx.hideLoading();
   },1000);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {

  },
  fSearchData(){
    this.getProjectList();
  },
  fInputSearch: function (e) {
    if (e.detail.value.length > 0) {
      this.setData({
        showicon: true,
        phonenum: e.detail.value
      });
    } else {
      this.setData({
        showicon: false,
        phonenum: ""
      });
    }
    this.getProjectList();
  },
  fClearData: function () {
    this.setData({
      showicon: false,
      phonenum: ""
    });
    this.getProjectList();
  },
  fNavCase(e){
    var _This=this;
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../projectcase/casetrail/casetrail?consultingId=' + dataset.consultationid + '&iname=' + dataset.iname + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + dataset.productcode
    });

  /*  wx.navigateTo({
      url: '../pcase/pcase?consultationId=' + dataset.consultationid + '&iname=' + dataset.iname + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + dataset.productcode
    });*/
  },
  fAddNew: function () {
    wx.navigateTo({
      url: '../projectcase/projectcase',
    })
  },
  /**
   * 获取用户列表
   */
  getProjectList(unionId,mobile) {
    wx.showLoading({
      title: 'loading...',
    });
    let _This = this;
    let pdata = {
      unionId: _This.data.oUInfo.unionId || "",
      mobile: _This.data.phonenum || "",
      pageSize: 10000
    };
    wxRequest(wxaapi.consult.list.url, pdata).then(function (result) {
      //console.log("load project info==>", result);
      if (result.data.code == 0) {
        _This.setData({ customerList: result.data.data.list });
      } else {
        console.log("load project info error==>", result);
      }
      wx.hideLoading();
    });
  },
  /**
   * 验证用户信息
   */
  fGetCUserInfo(unionid){
    var _This=this;
    let pdata = { unionid: unionid };
    wxRequest(wxaapi.user.userinfo.url, pdata).then(function (result) {
      if (result.data.code != 0 || result.data.data.type != "1") {
        _This.setData({
          showData: false
        });
      }
    });
  }
})