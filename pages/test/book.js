// pages/test/book.js
const wxaapi = require('../../public/wxaapi.js');
const wxRequest = require('../../utils/js/wxRequest.js');
const cutil = require("../../utils/js/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    projectItems: [],
    uicondata: "",
    oUserInfo: {},
    consultationId: "",
    jSelect: "",
    oEvent: {},//预约事件参数
    reserveId: 0,//预约id
    oUserInfo: {},
    customerInfo: { name: "nihao", phoneNum:"18811795986"},
    consultPorject: [],
    oAppointment: {},
    bdate:"",
    //bDate: new Date().getDay() < 10 ? "0" + new Date().getDay() : new Date().getDay(),
    btime: "10:00",
    bookdate: "",
    clueRemark: "",
    clueRemarkBk: "",
    clueStartDate: new Date(),
    // clueEndDate: new Date(),
    value: [9999, 1, 1],
    multiIndex: [0, 0, 0, 0, 0],
    flag: true,
    showpro:true,
    showphone:true,
    jSelect:[1,3],
    proerror:true,
    nameerror:"",
    phoneerror:"",
    sSelect: [],
    custmerinfo:[],
    arrData: [],
    active:"",
    isshow:""
   // totalerror:""
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    
    let _This = this;
    let nowtime=new Date();
    nowtime.setTime(nowtime.getTime() + 24 * 60 * 60 * 1000);
    //console.log("nowtime",nowtime)
    let dateadd1 = nowtime.getDate();
   // console.log("dateadd1-----",dateadd1)
    let DATE = dateadd1 < 10 ? "0" + dateadd1 : dateadd1;
   // console.log("DTAE",DATE);
    wx.showLoading({
      title: 'loading...',
    });
    _This.setData({
      bdate: "" + new Date().getFullYear() + "-" + new Date().getMonth() + 1 + "-"+DATE,
      consultationId: options.consultationId,
      jSelect: options.productCode
    });
    console.log("_This.data====>",_This.data);
    getApp().getUserData(function (uinfo) {
      uinfo && _This.getProjectList(uinfo.unionId);
    });
    this.checkbook();
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
    // wx.showModal({
    //   title: '提示',
    //   content: '预约成功'
    // })
    
  },
  //取列表
  getcustmerinfo(param) {
    let _This = this;
    let pdata = { unionId: param, all: 0 };
    wxRequest(wxaapi.product.list.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({ projectItems: result.data.data });
      } else {
      }
      wx.hideLoading();
    });
  },
  //取列表
  getProjectList(param) {
    let _This = this;
    let pdata = { unionId: param, all: 0 };
    wxRequest(wxaapi.product.list.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({ projectItems: result.data.data });
      } else {
      }
      wx.hideLoading();
    });
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
 * 客户姓名改变
 */
  fInputName(e) {
    let _This = this;
    let oCustomer = this.data.customerInfo;
    oCustomer.name = e.detail.value;
    this.setData({
      customerInfo: oCustomer
    });
    
    this.checkbook();
   // console.log("this data---customerInfo--", this.data.customerInfo);


  },
  checkname(){
    if (!/\S{1,}/.test(this.data.customerInfo.name)) {
      this.setData({
        nameerror: false
      });
    } else {
      this.setData({
        nameerror: true
      });
    }
  },
  checkbook(){
    this.checkphone();
    this.checkname();
    this.checkpro();
    let oAppointment = this.data.oAppointment;
    if (this.data.nameerror && this.data.phoneerror && this.data.proerror) {
      oAppointment.status = 0;
    } else {
      oAppointment.status = 1;
    }
    //  oAppointment.status = 0;
    this.setData({
      oAppointment: oAppointment
    });
  },
  /**
   * 电话改变
   */
  selectphone(){
    let _This = this;
    let oCustomer = this.data.customerInfo;
    oCustomer.phoneNum = 18811795986;
    this.setData({
      customerInfo: oCustomer
    });
    this.checkbook();
  },
  fInputMobile(e) {
    let _This=this;
    this.setData({ showphone: true });
    let oCustomer = this.data.customerInfo;
    oCustomer.phoneNum = e.detail.value;
    this.setData({
      customerInfo: oCustomer
    });
    this.checkbook();
   // console.log("this data---customerInfo--", this.data.customerInfo);
  },
  checkphone(){
    if (!/^1\d{10}$/.test(this.data.customerInfo.phoneNum)) {
      this.setData({
        phoneerror: false
      });
    } else {
      this.setData({
        phoneerror: true
      });
    };
  },

  // 预约时间改变
  bindDateChange: function (e) {
    this.setData({
      bdate: e.detail.value
    });
    //console.log("this---bdata----",this.data.bdate)
  
  },
  bindTimeChange: function (e) {
    this.setData({
      btime: e.detail.value
    });
    //console.log("this---btime----", this.data.btime)
  },




  /**
  * 弹出层函数
  */
  //出现
  show: function () {

    this.setData({ flag: false })

  },
  //消失

  hide: function () {

    this.setData({ flag: true })

  },
      // 项目选择弹出层
  showproduct:function(){
    this.setData({showpro:false})
  },
  hideproduct:function(){
    this.setData({ showpro: true })
  },
  //手机号选择弹出层
  showphone:function() {
  
    this.setData({ showphone: false })
  },
  hidephone: function () {
    this.setData({ showphone: true })
  },


  //提交预约
  submit:function(){
    
    
      wx.showToast({
        title: '预约成功',
        icon: 'success',
        duration: 2000
      })
  },

    //项目样式渲染
  
  selectItem: function (item) {
    let sItem = item.target.dataset;
    this.setData({
      jSelect: sItem.itemid
    });
    // console.log("=========",sItem);
    var arr = this.data.sSelect;
    var arrData = this.data.arrData;
    // console.log(arr.indexOf(sItem.itemid));
    if (arr.indexOf(sItem.itemid) == -1) {
      // console.log("=========================ffffff");
      arr.push(sItem.itemid);
      arrData.push(sItem);
     // console.log("888888888888888888", arrData);
    } else {
      var index = arr.indexOf(sItem.itemid);
      if (index > -1) {
        arr.splice(index, 1);
        arrData.splice(index, 1);
        console.log(arrData);
      }
    }
    this.setData({
      sSelect: arr,
      arrData: this.data.arrData
    });
    console.log("this.data.sSelect-----",this.data.sSelect);
    console.log("this.data.sSelect", this.data.arrData);
   this.checkpro();
   if (this.data.proerror){
     this.setData({
       isactive: true
     })
   }else{
     this.setData({
       isactive: false
     })
   }
  },
  checkpro(){
    if (this.data.sSelect.length <= 0) {
      this.setData({
        proerror: false
      });
    } else {
      this.setData({
        proerror: true
      });
    };
  },
  /**
   * 选好了
   */
  selectItems: function (item) {
    // console.log("=====================================");
    let sItem = item.target.dataset;
    // console.log(item);
    console.log(this.data.sSelect);
    if (this.data.sSelect.length <= 0) {
      return false;

    }
    this.setData({ showpro: true })
    this.checkbook();
    // console.log(sItem.paid);
  
  },

  selectTitle: function () {
    console.log("this is select title");
  },
})