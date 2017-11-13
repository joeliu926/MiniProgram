// pages/pcase/pcase.js
Page({
  data: {
      projectItems:[],
      uicondata:"adsffsdf"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This=this;
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
  selectItem:function(item){
    let seletItem=item.target.dataset;
   //console.log(item.target.dataset.iname);
   let iname = seletItem.iname;
   let itemid = seletItem.itemid;
   let paid = seletItem.paid;
   wx.navigateTo({
     url: 'citem/citem?iname=' + iname+'&itemid='+itemid+'&paid='+paid,
   });
  },
  selectTitle:function(){
     console.log("this is select title");
  },
  getProjectList(param){
    let _This=this;
    wx.request({
      url: "https://27478500.qcloud.la/wxa/product/list",
      method: "POST",
      data: {
        unionId: param
      },
      header: {
        'Content-Type': 'application/json'
      },
      success: function (result) {
        if(result.data.code==0){
          _This.setData({projectItems: result.data.data});
        }else{
          console.log(result);
        }
      }});
  }

})