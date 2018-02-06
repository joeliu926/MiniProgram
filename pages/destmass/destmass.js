const wxaapi = require('./../../public/wxaapi.js');//api地址参数
const wxRequest = require('./../../utils/js/wxRequest.js'); //请求参数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oUserInfo:{},
    noPhoneCount:"",
    isActive:false,// 是否可进入下一步
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This = this;
    getApp().getUserData(function (uinfo) {
      _This.setData({
        oUserInfo: uinfo
      });
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
  
    let _This = this;
    _This.fGetCroudList();
     wx.stopPullDownRefresh();
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
   * 选择人群下一步
   */
  fChooseNext(){
    if (!this.data.isActive){
      return false;
    }
    wx.navigateTo({
      url: '/pages/destmass/choosegift/choosegift',
    })
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
      console.log("get getcluesbyconsultid by sessionid--->", result);
      if (result.data.code == 0) {
       // let noCount =0;
        _This.setData({
          noPhoneCount: result.data.data["1"]||0,
          isActive:true
        });
      }
    });
  }
     
})