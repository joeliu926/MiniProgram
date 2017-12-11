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
    clueDate:new Date(),
    value: [9999, 1, 1],
    multiIndex: [0, 0, 0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("booking options=====>", options);
    let _This=this;
    getApp().getUserData(function (uinfo) {
          _This.setData({
            oUserInfo: uinfo,
            options: options
          });
          _This.getUserInfo();
          _This.getConsultProject();
          _This.fGetAppointment();

          _This.fBookingEvent();
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
   * 获取用户信息
   */
  getUserInfo(){
    let _This = this;
    let pdata = {
      customerId: _This.data.options.cid || "",
    };
   // console.log("--------------------------", pdata)
    wxRequest(wxaapi.customer.getcustomer.url, pdata).then(function (result) {
      //console.log("single==00000--user info===>", result);
      if (result.data.code == 0) {
        _This.setData({
          customerInfo: result.data.data
        });
        //console.log("_This.customerInfo----11111------------>", _This);
      } else {
        // console.log(result);
      }
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
    wxRequest(wxaapi.appointment.detail.url, pdata).then(function (result) {
     //console.log("booking==00000--appointment===>", result);
      if (result.data.code == 0) {
        result.data.data=typeof(result.data.data) == "object" ? result.data.data:{};
        _This.setData({
          oAppointment: result.data.data||{},
          bdate: cutil.formatTime(_This.data.bdate,"yyyy-MM-dd"),
          btime: cutil.formatTime(_This.data.btime, "hh:mm") 
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
   // console.log("_This.bookdate---------------->", bookDate);
    if (_This.data.bdate == "" || _This.data.btime == "" || _This.data.customerInfo.name==""){
       return false;
    }
    let cPorject = _This.data.consultPorject;
    let pCodes=[];
    cPorject.forEach(item=>{
      pCodes.push(item.productCode);
    });
    let pdata = {
      appointmentTime: new Date(bookDate).valueOf(),
     // consultId: _This.data.oUserInfo.unionId,
      sessionId: _This.data.options.consultingId,
      customerId: _This.options.cid,
      projectCodes: pCodes,
      remark: _This.data.oAppointment.remark,
      clueName: _This.data.clueRemark || (cutil.formatTime(new Date(), "yyyy-MM-dd") + "-" + _This.data.customerInfo.name)
    };

   // console.log("===================",pdata);
    let userupdate={
      id: _This.data.customerInfo.id,
      phoneNum: _This.data.customerInfo.phoneNum,
      name: _This.data.customerInfo.name,
      wechatNum: _This.data.customerInfo.wechatNum
    };
    wxRequest(wxaapi.customer.update.url, userupdate).then(function (updateResult) {
     // console.log("update customer====>", updateResult);
      return updateResult;
    }).then(function (updateResult){
      if (updateResult.data.code==0){
       wxRequest(wxaapi.appointment.send.url, pdata).then(function (result) {
          //console.log("booking==00000--send===>", result);

          if (result.data.code == 0) {
            let oAppointment = _This.data.oAppointment;
            oAppointment.status = 1;
            _This.setData({
              oAppointment: oAppointment,
              reserveId:result.data.data
            });
          } else {
            // console.log(result);
          }
        });
      }else{
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
    console.log("fffevent=====>", pdata);
    wxRequest(wxaapi.event.v2.url, pdata).then(function (result) {
      console.log("booking==00000--event===>", result);
      if (result.data.code == 0) {

      } else {
        // console.log(result);
      }
    });
  }
})