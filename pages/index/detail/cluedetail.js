// pages/index/detail/cluedetail.js
const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectItem: [{ id: 1, text: '互动', val: false }, { id: 2, text: '备注', val: true }],
    clueDetail:{},
    clueName:'',
    clueStage:'',
    remarklist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options.id);
  },
  bookOption(params) {
    let pobj = params.target.dataset.obj;
    wx.navigateTo({
      url: `../../projectcase/book/book?userId=${this.data.clueDetail.userId}&userUnionId=${this.data.clueDetail.userUnionId}&appointmentId=${this.data.clueDetail.appointmentId}&tenantId=${this.data.clueDetail.tenantId}&customerId=${this.data.clueDetail.customerId}&clueId=${this.data.clueDetail.id}&clueStatus=${this.data.clueDetail.clueStatus}`,
    });
  },
  initRemark(){
    let _This = this;
    let pdata = {
      clueId: this.data.clueDetail.id
    };
    wxRequest(wxaapi.index.remarklist.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
          remarklist: result.data.data.list,
        });
      } else {
        console.log("load project info error==>", result);
      }
    });
  },
  initData(params){
    let _This = this;
    let pdata = {
      id: params
    };
    wxRequest(wxaapi.index.cluedetail.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        console.log('result', result);
        let cname = result.data.data.customerName;
        if (!cname){
          cname = result.data.data.customerWxNickname;
        }else{
          if (result.data.data.customerWxNickname) {
            cname + '(' + result.data.data.customerWxNickname + ')';
          }
        }
          let slist = [];
          result.data.data.productList.forEach((sm, index) => {
            if (sm.productName && slist.length < 4) {
              slist.push(sm);
            }
          });
          result.data.data.productList = slist;
        _This.setData({
          clueDetail: result.data.data,
          clueName: cname,
        });

        _This.initRemark();
      } else {
        console.log("load project info error==>", result);
      }
 
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

  }
  ,
  selectType(params) {
    var dataset = params.currentTarget.dataset;
    this.data.selectItem.forEach(item => {
      if (item.id == dataset.id) {
        item.val = true;
      }
      else {
        item.val = false;
      }
    });
   /* this.setData({
      selectItem: this.data.selectItem
    });*/
  },
})