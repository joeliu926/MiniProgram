const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oCustomerList:[],
    "trackDesc": [
      {
        "leftTrack": {
          "subject": "",
          "code": "",
          "desc": "",
          "date": 1510891403033
        },
        "rightTrack": {
          "trackDetailList": [
            {
              "subject": "",
              "code": "",
              "desc": "",
              "date": 1510891403033,
              "imgNum": "",
              "imgUrls": []
            }
          ]
        }
      }
    ],
    "project": {
      "projectIds": [
        "2001",
        "3001"
      ],
      "projectName": ""
    },
    "customer": {
      "headPhotoUrl": "",
      "name": ""
    },
    "consultant": {
      "consultantName": "",
      "consultantLoginName": ""
    },
    "consultationStage": "",

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
//
 imgUrls: [
      '1'
    ],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000
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
  fSingleTrail(e){
   // console.log("single----e",e);
    let dataSet = e.currentTarget.dataset;
    var _This = this;
    wx.navigateTo({
     /* url: './cbooking/cbooking?consultingId=' + _This.data.consultingId + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + +_This.data.productCode*/
      url: '../singletrail/singletrail?consultingId=' + _This.data.consultingId + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + _This.data.productCode + '&csunionid=' + dataSet.unionid + '&cid=' + dataSet.cid
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
      //console.log("00000--trail===>", result);
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
  fGetCustomerList(){
    let _This = this;
    let pdata = {
      wxNickname:"",
      fieldValue:"",
      id: _This.data.consultingId||""
    };
    //console.log("user list pdata",pdata);
    wxRequest(wxaapi.consult.consultcustomers.url, pdata).then(function (result) {
      //console.log("customers--list===>", result.data.data.list); //oCustomerList
      if (result.data.code==0){
         _This.setData({ oCustomerList: result.data.data.list}); 
       }
    });
  },
  fSwiperChange(e){
    console.log("swiper ee====>",e);
  }
})