const wxaapi = require('../../public/wxaapi.js');
const wxRequest = require('../../utils/js/wxRequest.js');
Page({
  data: {
      projectItems:[],
      uicondata:"",
      oUserInfo:{},
      consultationId:"",
      jSelect:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // console.log("options pcase-->", wxaapi);
    let _This=this;
    wx.showLoading({
      title: 'loading...',
    });
    _This.setData({ 
      consultationId: options.consultationId,
      jSelect: options.productCode
      });
   // console.log("_This.data====>",_This.data);
    getApp().getUserData(function (uinfo) {
      uinfo && _This.getProjectList(uinfo.unionId);
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
    wx.hideShareMenu({});
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

  selectItem:function(item){
    let sItem=item.target.dataset;
    this.setData({
      jSelect: sItem.itemid
    });
      wx.navigateTo({
        url: 'citem/citem?iname=' + sItem.iname + '&itemid=' + sItem.itemid + '&paid=' + sItem.paid + '&paname=' + sItem.paname + '&consultationId=' + (this.data.consultationId||'')
      });


  },
  selectTitle:function(){
     console.log("this is select title");
  },
  /**
   * 获取项目列表信息
   */
  getProjectList(param){
    let _This=this;

    let pdata = {unionId: param};
    wxRequest(wxaapi.product.list.url, pdata).then(function (result) {
      //console.log("000000000000000000000000===>", result);
      if (result.data.code == 0) {
        _This.setData({ projectItems: result.data.data });
      } else {
        console.log(result);
      }
      wx.hideLoading();
    });
  }

})