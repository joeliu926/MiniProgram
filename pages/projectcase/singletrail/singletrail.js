const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    bookDate:"",
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
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("single-- options====>",options);
    let _This = this;
    getApp().getUserData(function (uinfo) {
      // console.log("single page uinfo=====>", uinfo);
      _This.setData({
        consultingId: options.consultingId || 0,
        oUInfo: uinfo,
        productCode: options.productCode,
        options: options

      });
      _This.fGetConsultationTrail();
      _This.fGetAppointment();
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
    _This.fGetConsultationTrail();
    _This.fGetAppointment();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  fSendCase() {
  },
  /**
   * 获取单个用户咨询轨迹
   */
  fGetConsultationTrail() {
    wx.showLoading({
      title: 'loading...',
    });
    let _This = this;
    let pdata = {
      unionId: _This.data.options.csunionid || "",
      consultingId: _This.data.consultingId
    };
    wxRequest(wxaapi.consult.singletrail.url, pdata).then(function (result) {
     //console.log("single==00000--trail===>", result);
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
   // wx.hideLoading();
  },
  /**
   * 获取用户预约信息
   */
  fGetAppointment() {
    let _This=this;
    let pdata = {
      sessionId: _This.data.consultingId,
      customerId: _This.data.options.cid,
      consultId:"",
      appointmentTime:"",
      remark: "",

      id: "",
      status: "",
      tenantId: "",

    };

    wxRequest(wxaapi.appointment.detail.url, pdata).then(function (result) {
     //console.log("single==00000--appointment===>", result);
      if (result.data.code == 0) {
        _This.setData({
          bookDate: result.data.data.appointmentTime
        });
      } else {
       // console.log(result);
      }
    });
  },
  fBooking(){
    let _This=this;
   // console.log("_This.options-------->",_This.options);
    wx.navigateTo({
      url: '../casetrail/cbooking/cbooking?csunionid=' + _This.options.csunionid + '&consultingId=' + _This.options.consultingId + '&productCode=' + _This.options.productCode + '&cid=' + _This.options.cid
    })
  }
})