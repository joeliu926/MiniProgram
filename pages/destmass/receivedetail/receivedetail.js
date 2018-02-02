const event = require('../../../public/js/wxEvent.js');
const tools = require('../../../utils/js/util.js');
const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
const wxPromise = require('../../../utils/js/wxPromise.js');//promise信息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTab:false,//切换tab
    oGift: {},//礼品对象
    aGiftList: ["11", "22", "33"],//礼品列表
    isShowMask: false,//显示授权手机号码提示框
    oUserInfo: {},//当前用户信息
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    current: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This = this;
    getApp().getUserData(function (uinfo) {
      //console.log("uinfo------------->", uinfo);
      _This.setData({
        oUserInfo: uinfo
      });

      _This.fGiftDetail();

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  /**
 * 切换改变
 */
  fSwiperChange(e) {
    console.log("change switch----", e);
  },
  /**
 * 获取礼品详情
 */
  fGiftDetail() {
    let _This = this;
    let pdata = {
      id: 1
    };
    //console.log("post data--->", pdata);
    wxRequest(wxaapi.gift.giftdetail.url, pdata).then(function (result) {
      //console.log("get giftdetail --->", result);
      if (result.data.code == 0) {
        _This.setData({
          oGift: result.data.data
        });
      }
    });
  },
  /**
   * 切换tab
   */
  fChangeTab(e){
    let _This=this;
    let isTab=false;
    if (e.target.dataset.istab){
      isTab = true;
    }
    _This.setData({
      isTab: isTab
    });


  }



})