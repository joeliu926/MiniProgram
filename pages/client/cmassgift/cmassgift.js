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
    aGiftList:["11","22","33"],//礼品列表
    isShowMask:false,//显示授权手机号码提示框
    oUserInfo:{},//当前用户信息
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    current:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This=this;
    getApp().getUserData(function (uinfo) {
      console.log("uinfo------------->", uinfo);
      _This.setData({
        oUserInfo: uinfo
        });
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
  fSwiperChange(e){
    console.log("change switch----",e);
  },
  /**
   * 立即领取formId
   */
  fFormRightNow(e){
    let _This=this;
    console.log("-------right now-------",e);
    _This.setData({
      isShowMask: true
    });
  },
  /**
   * 授权获取手机号码
   */
  getPhoneNumber(e) {
    let _This = this;
    _This.setData({
      isShowMask: false
    });
    wx.showLoading({
      title: '授权中...',
    });

   wx.navigateTo({
     url: 'giftsuccess/giftsuccess',
   })


    console.log("encryptedData----->", e);
    let eDetail = e.detail;
    if (!eDetail.encryptedData) {
      wx.hideLoading();
      return false;
    }
    eDetail.times = 0;
    _This.fAuthorization(eDetail, function (resPhone) {
      console.log("resPhone--------->", resPhone);
      if (isShowMask){
   
      }
      wx.hideLoading();
    });
  },
  /**
* 用户授权 eDetail用户授权返回对象
*/
  fAuthorization(eDetail, callback) {
    let _This = this;
    getApp().fGetSessionKey(false, function (sessionKey) {
      var postData = {
        encryptedData: eDetail.encryptedData,
        sessionKey: sessionKey,
        iv: eDetail.iv
      };
      wxRequest(wxaapi.unionid.userinfo.url, postData).then(resPhone => {
        if (resPhone.data.userinfo) {
          _This.setData({
            agree: 1
          });
          callback && callback(resPhone.data.userinfo.phoneNumber);
        } else {
          callback && callback(false);
        }
      });
    });
  },


})