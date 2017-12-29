const wxaapi = require('../../../../public/wxaapi.js');
const wxRequest = require('../../../../utils/js/wxRequest.js');
const cutil=require("../../../../utils/js/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oEvent:{},//预约事件参数
    reserveId:0,//预约id
    oUserInfo:{},
    customerInfo:{},
    consultPorject:[],
    oAppointment:{},
    bdate:"",
    btime:"",
    bookdate:"",
    clueRemark:"",
    clueRemarkBk: "",
    clueStartDate:new Date(),
    clueEndDate:new Date(),
    value: [9999, 1, 1],
    multiIndex: [0, 0, 0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("booking options=====>", options);
    let enddate = new Date();
      enddate.setFullYear((new Date().getFullYear()+2));
    let _This=this;
    getApp().getUserData(function (uinfo) {
          _This.setData({
            oUserInfo: uinfo,
            options: options,
            clueEndDate: enddate
          });
          console.log("_This.data=====>", _This.data);
          _This.getUserInfo();
          _This.getConsultProject();
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
 * 客户姓名改变
 */
  fInputName(e){
    let oCustomer = this.data.customerInfo;
    oCustomer.name=e.detail.value;
    this.setData({
      customerInfo: oCustomer
    });
    console.log("this data---customerInfo--", this.data.customerInfo);


  },
  /**
   * 电话改变
   */
  fInputMobile(e){
    let oCustomer = this.data.customerInfo;
    oCustomer.phoneNum = e.detail.value;
    this.setData({
      customerInfo: oCustomer
    });
  },
  /**
   * 客户登录名改变loginName
   */
  fInputloginName(e){
    let oCustomer = this.data.customerInfo;
    oCustomer.wechatNum = e.detail.value;
    this.setData({
      customerInfo: oCustomer
    });
  },
  /**
   * 客户线索备注改变
   */
  fInputClueRemark(e){
    this.setData({
      clueRemark: e.detail.value
    });
  },
  /**
   * 备注改变
   */
  fInputRemark(e){
    let oAppoint = this.data.oAppointment;
   // console.log("oAppoint============>", oAppoint);
    oAppoint.remark = e.detail.value;
   

    this.setData({
      oAppointment: oAppoint
    });
  },

  fBooking:function(e){
    console.log(e.detail.value);
  },
  bindDateChange:function(e){
 this.setData({
   bdate:e.detail.value
   });
  },
  bindTimeChange: function (e) {
    this.setData({
      btime: e.detail.value
    });
  },

  /**
   * 获取客户信息
   */
  getUserInfo(){

    wx.showLoading({
      title: 'loading...',
    });
    let _This = this;
    let pdata = {
      customerId: _This.data.options.cid || "",
    };
    wxRequest(wxaapi.customer.getcustomer.url, pdata).then(function (result) {
      //console.log("single==00000--user info===>", result);
      if (result.data.code == 0) {
        _This.setData({
          customerInfo: result.data.data,
          clueRemarkBk: cutil.formatTime(new Date(), "yyyy-MM-dd") + "-" + (result.data.data.name || result.data.data.nickname||"-")

        });
        _This.fClueDetail();
      } else {
        // console.log(result);
      }
      wx.hideLoading();
    });
  },
  /**
   * 获取项目列表
   */
  getConsultProject() {
    let _This = this;
    let pdata = {
      customerUnionId: _This.data.options.csunionid || "",
      id: _This.data.options.consultingId
    };
    wxRequest(wxaapi.consult.consultitems.url, pdata).then(function (result) {
     // console.log("single==00000--consult project===>", result);
      if (result.data.code == 0) {
        _This.setData({
          consultPorject: result.data.data
        });
      } else {
        // console.log(result);
      }
    });
  },
  /**
 * 获取用户预约信息
 */
  fGetAppointment() {
    let _This = this;
    let pdata = {
      sessionId: _This.data.options.consultingId,
      customerId: _This.data.options.cid,
    };
    //console.log("pdata----1111--->", pdata);
    wxRequest(wxaapi.appointment.detail.url, pdata).then(function (result) {
     // console.log("booking==00000--appointment===>", result, typeof (result.data.data));
     let appointmentTime = result.data.data.appointmentTime;
      if (result.data.code == 0) {
        result.data.data=typeof(result.data.data) == "object" ? result.data.data:{};
        _This.setData({
          oAppointment: result.data.data||{},
          bdate: appointmentTime?cutil.formatTime(appointmentTime, "yyyy-MM-dd"):"请选择",
          btime: appointmentTime?cutil.formatTime(appointmentTime, "hh:mm"):""  
        });
      } else {
        // console.log(result);
      }
    });
  },
  /**
 * 获取客户线索详情
 */
  fClueDetail() {
    let _This = this;

    let pdata = {
      sessionId: _This.data.options.consultingId,
      customerId: _This.data.options.cid
    };
     console.log("fffevent=====>", pdata);
    wxRequest(wxaapi.clue.detail.url, pdata).then(function (result) {
      console.log("_This.data.clueRemarkBk----->", result.data, typeof(result.data.data));
      if (result.data.code == 0) {
        _This.setData({
          clueRemark: result.data.data.name || _This.data.clueRemarkBk||"-"
        });
      } else {
        // console.log(result);
      }
    });
  },
  /**
   * 提交预约信息
   */
  fSubmitData(){
    let _This = this;
    let bookDate = _This.data.bdate + " " + _This.data.btime;
    wx.showLoading({
      title: '提交中...'
    })
    console.log("user data---customerInfo---", _This.data.customerInfo);
    if (_This.data.bdate == "" || _This.data.btime == "" || !_This.data.customerInfo.name|| _This.data.customerInfo.name==""){
      console.log("_This.data.bdate----->", _This.data.bdate);
      wx.hideLoading();
       return false;
    }
    let cPorject = _This.data.consultPorject;
    let pCodes=[];
    cPorject.forEach(item=>{
      pCodes.push(item.productCode);
    });

    let aTime = cutil.str2Date(bookDate).valueOf();
    console.log("aTime---------->",aTime);
    let pdata = {
      appointmentTime: aTime,
      sessionId: _This.data.options.consultingId,
      customerId: _This.options.cid,
      projectCodes: pCodes,
      remark: _This.data.oAppointment.remark,
      clueName: _This.data.clueRemark || _This.data.clueRemarkBk
    };

    console.log("=======pdata============",pdata);
    let userupdate={
      id: _This.data.customerInfo.id,
      phoneNum: _This.data.customerInfo.phoneNum,
      name: _This.data.customerInfo.name,
      wechatNum: _This.data.customerInfo.wechatNum
    };
    wxRequest(wxaapi.customer.update.url, userupdate).then(function (updateResult) {
      console.log("update customer====>", updateResult);
      return updateResult;
    }).then(function (updateResult){
      if (updateResult.data.code==0){
       wxRequest(wxaapi.appointment.send.url, pdata).then(function (result) {
         console.log("result.data---appointment-->", result.data);
          if (result.data.code == 0) {
            let oAppointment = _This.data.oAppointment;
            oAppointment.status = 1;
            _This.setData({
              oAppointment: oAppointment,
              reserveId:result.data.data
            });
            wx.hideLoading();
            _This.fBookingEvent();
          } else {
            wx.hideLoading();
          }
        });
      }else{
        wx.hideLoading();
        console.log(updateResult);
      }
    });
  },
  /*
  *预约事件参数
 */
  fGetTempEvent() {
    var _This = this;
    var oTempEvent = _This.data.oEvent;
    oTempEvent.code ="reserve";
    oTempEvent.eventAttrs = {
      triggeredTime:new Date().valueOf(),//触发时间
      appletId: "hldn",//app小程序
      consultingId: _This.data.options.consultingId,//会话id
      reserveId: _This.data.reserveId,//预约id
      appid: "yxy",//营销云
      openid: "",
      unionid: _This.data.options.csunionid,
    };
    oTempEvent.subjectAttrs = {
      consultantId: _This.data.oUserInfo.unionId
    };
    _This.setData({
      oEvent: oTempEvent
    });
  },
  /**
   * 预约事件
   */
  fBookingEvent(){
    let _This=this;
    _This.fGetTempEvent();
    let pdata = _This.data.oEvent;
   // console.log("fffevent=====>", pdata);
    wxRequest(wxaapi.event.v2.url, pdata).then(function (result) {
      //console.log("booking==00000--event===>", result);
      if (result.data.code == 0) {

      } else {
        // console.log(result);
      }
    });
  }
})