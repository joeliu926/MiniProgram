const apiUser = require('../../utils/APIUinfo.js');
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
    if (getApp().globalData.flag) {
      wx.navigateBack({
        delta: 1
      })
      wx.navigateBack({
        delta: 1
      })
    } 
    var _This = this;
    getApp().getUserData(function (result) {
      _This.fGetCUserInfo(result.unionId);
      _This.setData({
        oUInfo: result
      });
      _This.getProjectList();
    });
  
    // console.log(getApp().globalData.userInfo);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //console.log("---------2222-----------------");
 
  
    //console.log("+++++++++33333+++++++++++++++++");
   
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
      url: '../pcase/casetrail/casetrail?consultingId=' + dataset.consultationid + '&iname=' + dataset.iname + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + dataset.productcode
    });

  /*  wx.navigateTo({
      url: '../pcase/pcase?consultationId=' + dataset.consultationid + '&iname=' + dataset.iname + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + dataset.productcode
    });*/
  },
  fAddNew: function () {
    wx.navigateTo({
      url: '../pcase/pcase',
    })
  },
  getProjectList(unionId,mobile) {
    wx.showLoading({
      title: 'loading...',
    });
    let _This = this;
    //console.log(_This.data.phonenum);
    wx.request({
      url: "https://27478500.qcloud.la/wxa/consult/list",
      method: "POST",
      data: {
        unionId: _This.data.oUInfo.unionId||"",
        mobile: _This.data.phonenum||"",
        pageSize:10000
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
       //console.log("project====>", result.data.data.list);
        if (result.data.code == 0) {
          _This.setData({ customerList: result.data.data.list });
         // console.log(result.data.data.list);
        } else {
          console.log(result);
        }
        wx.hideLoading();
      }
    });
  },
  fGetCUserInfo(unionid){
    var _This=this;
    apiUser.uinfo(unionid, function (result) {
        //console.log(result);
        if(result.data.code!=0||result.data.data.type!="1"){
          _This.setData({
            showData:false
          });
        }

    });
  }


})