const wxaapi = require('./../../../public/wxaapi.js');//api地址参数
const wxRequest = require('./../../../utils/js/wxRequest.js'); //请求参数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    aGiftList:[],//获取列表
    giftId:0,//选中的id
    isActive:false, //按钮是否处于激活状态
    pageNo:1,
    pageSize:10,
    lastPage:false,
    pageNum:1,//第几页
    oUserInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This = this;
    getApp().getUserData(function (uinfo) {
      console.log("uinfo------------->", uinfo);
      _This.setData({
        oUserInfo: uinfo
      });
      _This.fGetGiftList();

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
    
    let pageNo = this.data.pageNo;
    let lastPage = this.data.lastPage;
    if (lastPage){
      wx.showToast({
        title: '没有更多数据',
      });
      return false;
    }
    pageNo++;
    console.log("reach bottom------>", pageNo);
    this.setData({
      pageNo: pageNo
    });
    this.fGetGiftList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 选择改变
   */
  fSelectChange(e){
   this.setData({
     giftId:e.detail.value
   });
  },
  /**
   * 获取礼品列表
   */
  fGetGiftList(){
    let _This = this;
    wx.showLoading({
      title: 'loading...',
    });
   // let pNum = _This.data.pageNum;
    let pdata = {
      pageNo: _This.data.pageNo,
      pageSize: _This.data.pageSize,
      userUnionId: _This.data.oUserInfo.unionId,
      status:0
    };
    wxRequest(wxaapi.gift.pagelist.url, pdata).then(function (result) {
      console.log("result------->",result);
      let aGiftList = _This.data.aGiftList||[];
      if (result.data.code == 0) {
        let aList = result.data.data.list;
        aGiftList.push(...aList)
        _This.setData({
          aGiftList: aGiftList,
          lastPage: result.data.data.lastPage
        });
      };
      wx.hideLoading();
    });
  },
  /**
   * 跳转至预览
   */
  fChooseNext(){
    let giftid = this.data.giftId;
    if (giftid<=0) {
      return false;
    }
  wx.navigateTo({
    url: `/pages/destmass/previewgift/preview?giftid=${giftid}`,
  })
  }
})