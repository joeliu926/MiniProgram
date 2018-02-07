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
    pageNo:1, //页面编号
    pageSize:10,//每页条数
    lastPage: false,//是否是最后一页
    isTab:false,//切换tab
    oGift: {},//礼品对象
    aApponitList: [],//预约列表
    aPageNo:1,
    aPageSize:10,
    aLastPage: false,
    aNoApponitList: [],//未预约列表
    aNoPageNo: 1,
    aNoPageSize: 10,
    aNoLastPage: false,
    isShowMask: false,//显示授权手机号码提示框
    oUserInfo: {},//当前用户信息
    type:0,//切换tab 0未处理  1已预约
    aCount:[],//各阶段的数量集合
    maxCount:1,//最大的值
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    current: 0,
    totalPic:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This = this;
    getApp().getUserData(function (uinfo) {
     // console.log("uinfo------------->", uinfo);
      _This.setData({
        oUserInfo: uinfo,
        consultationId: options.consultationId||"1727",
        cstUid: uinfo.unionId,
        options: options
      });

      _This.fGiftDetail();
      _This.fGetPageList();
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
    let _This=this;
    let isTab = _This.data.isTab;
    let lastPage = isTab ? _This.data.aLastPage : _This.data.aNoLastPage;
    if (lastPage) {
      wx.showToast({
        title: '没有更多数据',
      });
      return false;
    }
    let pageNo = isTab ?_This.data.aPageNo:_This.data.aNoPageNo;
    pageNo++;
    isTab?_This.setData({ aPageNo: pageNo }):_This.setData({ aNoPageNo: pageNo});
    _This.fGetPageList();//触及底部刷新
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
    this.setData({
      current: e.detail.current
    });
  },
  /**
 * 获取礼品详情
 */
  fGiftDetail() {
    let _This = this;
    let pdata = {
      id: _This.data.options.giftid||1
    };
    //console.log("post data--->", pdata);
    wxRequest(wxaapi.gift.giftdetail.url, pdata).then(function (result) {
      //console.log("get giftdetail --->", result);
      if (result.data.code == 0) {
        _This.setData({
          oGift: result.data.data,
          totalPic: result.data.data.giftPictures.length
        });     
      }
    });
  },
  /**
   * 获取收礼客户
   */
  fGetGiftCustomer(){
    let _This = this;
    let pdata = {
      sessionId: _This.data.consultationId
    };
  },
  /**
   * 过滤页码
   */
  fFilterPageNo(){
    let _This=this;
    let isTab = _This.data.isTab;
    let pageNo = isTab ? _This.data.aPageNo : _This.data.aNoPageNo;
    let lastPage = isTab ? _This.data.aLastPage : _This.data.aNoLastPage;
     _This.setData({
       pageNo: pageNo,
       lastPage: lastPage
     });
  },
  /**
   * 获取发送预约列表
   */
  fGetPageList(){
    let _This = this;
    _This.fFilterPageNo();
    let isTab = _This.data.isTab;
    let pdata = {
      sessionId: _This.data.consultationId,
      consultUnId: _This.data.cstUid,
      type: isTab?"1":"0",
      pageNo: _This.data.pageNo,
      pageSize: _This.data.pageSize
    };
    wx.showLoading({
      title: 'loading...',
    })
    //console.log("post pagelist--->", pdata);
    wxRequest(wxaapi.activityrecord.pagelist.url, pdata).then(function (result) {
      console.log("get pagelist --->", result);
      if (result.data.code == 0) {
        let rsList = result.data.data.list;
        let aApponitList = _This.data.aApponitList;
        let aNoApponitList = _This.data.aNoApponitList;
        let alist = isTab ? aApponitList.push(...rsList):aNoApponitList.push(...rsList);
        //aApponitList.concat(result.data.data.list);
        let lastPage=result.data.data.lastPage;
         isTab?_This.setData({ aLastPage: lastPage }):_This.setData({ aNoLastPage: lastPage});
        _This.setData({
          aApponitList: aApponitList,
          aNoApponitList: aNoApponitList
        });
      }
      wx.hideLoading();
      _This.fGetAlready();
    });
  },
  /**
   * 获取已预约总数
   */
  fGetAlready(){
    let _This = this;
    let aCount=[];
    let pdata = {
      sessionId: _This.data.consultationId,
      consultUnId: _This.data.cstUid
    };
    wxRequest(wxaapi.consult.getrecordnum.url, pdata).then(function(result){
      //console.log("----fGetAlready--111--result----------", result);
            let recordCount = result.data.code == 0 ? result.data.data : 0;
            aCount.push(recordCount);
            return wxRequest(wxaapi.activityrecord.getnum.url, pdata);
    }).then(function(result){
          let getGiftCount = result.data.code == 0 ? result.data.data:0;
          aCount.push(getGiftCount);
          return wxRequest(wxaapi.activityrecord.getalreadyappointmentnum.url, pdata); 
    }).then(function(result){
          let alreadyCount = result.data.code == 0 ? result.data.data : 0;
          aCount.push(alreadyCount);
          let maxCount = Math.max.apply(null, aCount)||1;
          _This.setData({
            aCount: aCount,
            maxCount: maxCount
          });
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
    let aLIst=isTab?_This.data.aApponitList:_This.data.aNoApponitList;
    aLIst.length<=0&&_This.fGetPageList();
  },
  /**
   * 线索详情
   */
  fGoToClueDetail(e){
    let clueid = e.currentTarget.dataset.clueid;
    wx.navigateTo({
      url: `/pages/index/detail/cluedetail?id=${clueid}`
    });
  }
})