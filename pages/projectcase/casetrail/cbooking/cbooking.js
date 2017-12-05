const wxaapi = require('../../../../public/wxaapi.js');
const wxRequest = require('../../../../utils/js/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    multiArray: [['11', '11'], ['22', '222', '2222', '22222', '222222'], ['33', '333'], ['44', '444'], ['55', '55555']],
    multiIndex: [0, 0, 0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
    let _This=this;
    getApp().getUserData(function (uinfo) {
      console.log("booking options=====>", uinfo);
          _This.setData({
            oUserInfo: uinfo,
            options: options
          });
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
  },
  /**
   * 电话改变
   */
  fInputMobile(e){
    let oCustomer = this.data.customerInfo;
    oCustomer.name = e.detail.value;
    this.setData({
      customerInfo: oCustomer
    });
  },
  /**
   * 客户登录名改变loginName
   */
  fInputloginName(){
    let oCustomer = this.data.customerInfo;
    oCustomer.loginName = e.detail.value;
    this.setData({
      customerInfo: oCustomer
    });
  },
  /**
   * 客户线索备注改变
   */
  fInputClueRemark(){
    this.setData({
      clueRemark: e.detail.value
    });
  },
  /**
   * 备注改变
   */
  fInputRemark(e){
    let oAppoint = this.data.oAppointment;
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
      unionid: _This.data.options.csunionid || "",
    };
    wxRequest(wxaapi.user.userinfo.url, pdata).then(function (result) {
      console.log("single==00000--user info===>", result.data.data);
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
      console.log("single==00000--consult project===>", result);
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
      consultId: "",
      appointmentTime: "",
      remark: "",

      id: "",
      status: "",
      tenantId: "",

    };
    wxRequest(wxaapi.appointment.detail.url, pdata).then(function (result) {
     // console.log("booking==00000--appointment===>", result);
      if (result.data.code == 0) {
        _This.setData({
          oAppointment: result.data.data||{}
        });
      } else {
        // console.log(result);
      }
    });
  },
  fSubmitData(){
    let _This = this;
    console.log("_This.customerInfo---------------->",_This.data.customerInfo);
    if (_This.data.bdate == "" || _This.data.btime == "" || _This.data.customerInfo.name==""){
       return false;
    }
    let cPorject = _This.data.consultPorject;
    let pCodes=[];
    cPorject.forEach(item=>{
      pCodes.push(item.productCode);
    });
    let pdata = {
      appointmentTime: new Date(_This.data.bdate + " " + _This.data.btime).valueOf(),
      consultId: _This.data.oUserInfo.unionId,
      customerId: _This.options.cid,
      projectCodes: pCodes,
      remark: _This.data.oAppointment.remark,
      clueName: _This.data.clueRemark
    };

    console.log("===================",pdata);

    wxRequest(wxaapi.appointment.send.url, pdata).then(function (result) {
      console.log("booking==00000--send===>", result);
      if (result.data.code == 0) {

      } else {
        // console.log(result);
      }
    });
  }
})