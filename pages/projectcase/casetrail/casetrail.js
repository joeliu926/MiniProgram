const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oCustomerList:[],


    oUInfo: {},
    oEvent: {
      code: "",
      eventAttrs: {
        appletId: "hldn",
        consultingId: 0,
        consultantId: "",
        triggeredTime: "",
        case: "",
        isLike: "",
        image: {}

      },
      subjectAttrs: {
        appid: "yxy",
        consultantId: "",
        openid: "",
        unionid: "",
        mobile: ""
      }
    },
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    pageNo:1,
    pageSize:1000,
    oSwiperCustomerList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   // console.log("options====>",options);
    let _This = this;
    getApp().getUserData(function (uinfo) {
      //console.log("uinfo=====>", uinfo);
      _This.setData({
        consultingId: options.consultingId||0,
        oUInfo: uinfo,
        productCode: options.productCode
      });
      _This.fGetConsultationTrail();
      _This.fGetCustomerList();

    });

  },
  onReady: function () {
  },
 

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let _This=this;
    _This.fGetConsultationTrail();
    _This.fGetCustomerList();
     wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  fSingleTrail(e){
    let dataSet = e.currentTarget.dataset;
    let _This = this;
   // console.log("single trail---->", _This.fGetSingleCustomerIdByUnid(dataSet.unionid));
    let cid = dataSet.cid||_This.fGetSingleCustomerIdByUnid(dataSet.unionid);
    wx.navigateTo({
      url: '../singletrail/singletrail?consultingId=' + _This.data.consultingId + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + _This.data.productCode + '&csunionid=' + dataSet.unionid + '&cid='+cid
    });
  },
  fUserList(){
    var _This = this;
    wx.navigateTo({
      url: './userlist/userlist?consultingId=' + _This.data.consultingId + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + +_This.data.productCode
    });
  },
  fSendCase(){
    var _This=this;
    wx.navigateTo({
      url: '/pages/projectcase/projectcase?consultationId=' + _This.data.consultingId + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + +_This.data.productCode
    });
  },
  /**
   * 获取咨询轨迹
   */
  fGetConsultationTrail() {
    wx.showLoading({
      title: 'loading...',
    });
    let _This = this;
    let pdata = {
      unionId: _This.data.oUInfo.unionId || "",
      consultingId: _This.data.consultingId
    };
    wxRequest(wxaapi.consult.trail.url, pdata).then(function (result) {
      //console.log("00000--trail--all===>", result);
      if (result.data.code == 0) {
        _This.setData({
          trackDesc: result.data.data.trackDesc,
          customer: result.data.data.customer,
          consultant: result.data.data.consultant,
          project: result.data.data.project,
          consultationStage: result.data.data.consultationStage
        });
      } else {
        console.log(result);
      }
      wx.hideLoading();
    });
    wx.hideLoading();
  },
  /**
   * get customer list
   */
  fGetCustomerList(){
    let _This = this;
    let pdata = {
      wxNickname:"",
      fieldValue:"",
      id: _This.data.consultingId||"",
      pageNo:_This.data.pageNo,
      pageSize:_This.data.pageSize
    };
    //console.log("user list pdata",pdata);
    wxRequest(wxaapi.consult.consultcustomers.url, pdata).then(function (result) {
      if (result.data.code==0){
        _This.fGenerateUserList(result);
       }
    });
  },
  fSwiperChange(e){
    let _This=this;
  //  let currentPage=e.detail.current+1;
  },
  /**
   * 通过用户unionid获取用户id
   */
  fGetSingleCustomerIdByUnid(cunionid){
    let _This = this;
    let ocList = _This.data.oCustomerList || [];
    let result="";
    ocList.forEach(item => {
     // console.log("ooitem--->", item);
      if (item.unionid == cunionid){
        result=item.id
      }
    });
    return result;
  },
  /**
   * 生成用户列表显示
   */
  fGenerateUserList(result){
    let _This=this;
    let iSize = 9;
    let count = result.data.data.count;
    let pCount = Math.ceil(count / iSize);
    let lastCount = count % iSize == 0 ? iSize : count % iSize;
    let oSwiperCustomerList = [];// _This.data.oSwiperCustomerList; 
    //console.log("oSwiperCustomerList- result----->", result);
    for (let i = 0; i < pCount; i++) {
      let start = i * iSize;
      let end = i * iSize + iSize;
      if (i == pCount - 1) {
        end = i * iSize + lastCount;
      }
      let oSwiperItem = {};
      oSwiperItem.oUInfo = _This.data.oUInfo;
      let ilist = result.data.data.list;
      oSwiperItem.oCustomerList = ilist.slice(start, end);
      oSwiperCustomerList.push(oSwiperItem);
    }
    _This.setData({
      oSwiperCustomerList: oSwiperCustomerList,
      oCustomerList: result.data.data.list,
      indicatorDots: oSwiperCustomerList.length > 1 ? true : false
    });
  }
})