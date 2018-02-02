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
    oUserInfo: {},//当前用户信息
    oGift:{},//礼品详情
    noPhoneCount:0,//目标人群
    giftid:0,//获取的礼品id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("options------------->", options);
    let _This = this;
    getApp().getUserData(function (uinfo) {
      //console.log("uinfo------------->", uinfo);
      _This.setData({
        oUserInfo: uinfo,
        options: options
      });

      _This.fGiftDetail();
      _This.fGetCroudList();
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
 * 获取礼品详情
 */
  fGiftDetail() {
    let _This = this;
    let pdata = {
      id: _This.data.options.giftid
    };
   // console.log("preview post data--->", pdata);
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
 * 获取目标人群接口V0.3.3
 */
  fGetCroudList() {
    let _This = this;
    let pdata = {
      types: 1,
      consultUnionId: _This.data.oUserInfo.unionId
    };
    //console.log("post data--->", pdata);
    wxRequest(wxaapi.consult.getcluesbyconsultid.url, pdata).then(function (result) {
      //console.log("get getcluesbyconsultid by sessionid--->", result);
      if (result.data.code == 0) {
        _This.setData({
          noPhoneCount: result.data.data["1"]
        });
      }
    });
  },
  /**
   * 发送礼品
   */
  fSendGift(){
   console.log("send gift---'");
  }
})