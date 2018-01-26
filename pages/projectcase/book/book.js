// pages/test/book.js
const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
const cutil = require("../../../utils/js/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isactive:"",
    isShow:"",
    oUInfo:{},
    projectItems: [],
    uicondata: "",
    oUserInfo: {},
    appointmentId:"",
    clueId:"",
    customerId:"",
    consultUnId:"",
    consultationId: "",
    jSelect: "",
    oEvent: {},//预约事件参数
    reserveId: 0,//预约id
    //oUserInfo: {},
    bcustomerInfo: [],
    customerInfo: [],
    consultPorject: [],
    oAppointment: {},
    status:"",
    nextdate:"",
    bdate:"",
    //bDate: new Date().getDay() < 10 ? "0" + new Date().getDay() : new Date().getDay(),
    btime: "",
    bookdate: "",
    clueRemark: "",
    clueRemarkBk: "",
    clueStartDate: new Date(),
    // clueEndDate: new Date(),
    value: [9999, 1, 1],
    multiIndex: [0, 0, 0, 0, 0],
    flag: true,
    showpro:true,
    showtextarea:true,
    showphone:true,
    jSelect:[1,3],
    proerror:true,
    nameerror:"",
    phoneerror:"",
    sSelect: [],
    custmerinfo:[],
    arrData: [],
    active:"",
    clueStatus:"",
    
    
   // totalerror:""
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    
    // console.log("booking options=====>", options);
   
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
   // console.log("options.clueStatus", options.clueStatus)
    
    //console.log("status", this.data.status)
    _This.setData({
      clueStatus: options.clueStatus,
      customerId: options.customerId,
      clueId: options.clueId,
      appointmentId:options.appointmentId,
      nextdate: "" + new Date().getFullYear() + "-" + new Date().getMonth() + 1 + "-"+DATE,
      consultationId: options.consultationId,
      jSelect: options.productCode
    });
    //console.log("_This.data====>",_This.data);
    getApp().getUserData(function (uinfo) {
      uinfo && _This.getProjectList(uinfo.unionId);
    });
    // getApp().getUserData(function (result) {
    //   console.log("loading use info=====>", result);
     
      // _This.setData({
      //   oUInfo: result
      // });
     
    // });
    getApp().getUserData(function (uinfo) {
 
      _This.setData({
        oUserInfo: uinfo,
        // options: options,
    
      });
     // console.log("_This.data=====>", _This.data);
     
      _This.getUserInfo();
      _This.fGetAppointment();
     

    });
    this.checkbook();
    _This.clearTimeout();
    
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
  getProjectList(param) {
    let _This = this;
    let pdata = { unionId: param };
    wxRequest(wxaapi.product.list.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({ projectItems: result.data.data });
        // console.log("result.data.data", result.data.data)
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
  //提示已关闭
  clearTimeout(){
    let _This=this;
    //console.log("cluestatus", this.data.clueStatus)
    clearTimeout(timer);
    if (this.data.clueStatus == 5) {
    this.setData({
      isShow:true,
    });
    // console.log("isShow", this.data.isShow)
    var timer = setTimeout(function () {
      _This.setData({
        isShow: !_This.data.isShow
      });
    }, 2000);
    
  } },
  /**
 * 客户姓名改变
 */
  fInputName(e) {
    let _This = this;
    let oCustomer = this.data.customerInfo;
    oCustomer.name = e.detail.value;
    this.setData({
      bcustomerInfo: oCustomer
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
    
    // console.log("this.data.nameerror", this.data.nameerror);
    // console.log("this.data.phoneerror", this.data.phoneerror);
    // console.log("this.data.proerror", this.data.proerror);

    if (this.data.status!=1&&this.data.nameerror && this.data.phoneerror && this.data.proerror) {
      oAppointment.status = 0;
    } else {
      oAppointment.status = 1;
    }
    //  oAppointment.status = 0;
    this.setData({
      oAppointment: oAppointment
    });
   // console.log("this.data.oAppointment--------------++++>", this.data.oAppointment)
    if (this.data.proerror) {
      this.setData({
        isactive: true
      })
    } else {
      this.setData({
        isactive: false
      })
    }

  },
  /**
   * 电话改变
   */
  selectphone(){
    let _This = this;
    let oCustomer = this.data.customerInfo;
    oCustomer.phoneNum = 18811795986;
    this.setData({
      bcustomerInfo: oCustomer
    });
    this.checkbook();
  },
  fInputMobile(e) {
    let _This=this;
    this.setData({ showphone: true });
    let oCustomer = this.data.customerInfo;
    oCustomer.phoneNum = e.detail.value;
    this.setData({
      bcustomerInfo: oCustomer
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
  /**
  * 客户线索备注改变
  */
  fInputClueRemark(e) {
    this.setData({
      clueRemark: e.detail.value
    });
    // console.log("beizhu------", this.data.clueRemark);
   // console.log("cucustomerInfo", this.data.customerInfo)
  },
  // /**
  //  * 备注改变
  //  */
  // fInputRemark(e) {
  //   let oAppoint = this.data.oAppointment;
  //   // console.log("oAppoint============>", oAppoint);
  //   oAppoint.remark = e.detail.value;


  //   this.setData({
  //     oAppointment: oAppoint
  //   });
  //   console.log("beizhu------", this.data.oAppointment)
  // },


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
    this.setData({showpro:false,
                  showtextarea:false
    });
    // console.log("showtextarea", this.data.showtextarea)
    this.checkbook();
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
      title: '预约失败',
      image: '../../public/images/no_data.png',
      icon: 'success',
      duration: 4000
    });
    // let _This = this;
    // let bookDate = _This.data.bdate + " " + _This.data.btime;
   
    // let Bookdate = Date.parse(new Date(bookDate));
    // console.log("bookdae-----", Bookdate);\
    // clearTimeout(timere);
    //   wx.showToast({
    //     title: '预约成功',
    //     icon: 'success',
    //     duration: 2000
    //   });
    //   var timere = setTimeout(function () {
    //     wx.navigateTo({
    //       url: '../../index/home'
    //     });
    //   }, 2500);
     
      
  },

    //项目选择
  
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
       // console.log(arrData);
      }
    }
    this.setData({
      sSelect: arr,
      arrData: this.data.arrData
    });
   // console.log("this.data.sSelect-----",this.data.sSelect);
   // console.log("this.data.sSelect", this.data.arrData);
   this.checkpro();
   //if this.data.status != 1
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

  // 项目删除
  deletepro:function(oitem1){
    let sparam = oitem1.target.dataset;
   // console.log("param", sparam);
    for (let i = 0; i < this.data.arrData.length;i++){
      if (sparam.id == this.data.arrData[i].itemid){
        this.data.arrData.splice(i,1)
      }
    } 
    //console.log("this.data.arrData",this.data.arrData)
    for (let i = 0; i < this.data.sSelect.length; i++) {
      if (sparam.id == this.data.sSelect[i]) {
        this.data.sSelect.splice(i, 1)
      }
    }
    this.setData({
      arrData: this.data.arrData,
      sSelect: this.data.sSelect
    });
    this.checkbook()
    //console.log("sSelect", this.data.sSelect)
  },
  /**
   * 选好了
   */
  selectItems: function (item) {
    //console.log("this.data.arrData",this.data.arrData);
    //console.log("this.data.sSelect", this.data.sSelect);
    // console.log("=====================================");
    let sItem = item.target.dataset;
    //console.log(sItem);
   // console.log(this.data.sSelect);
    if (this.data.sSelect.length <= 0) {
      return false;

    }
    this.setData({ showpro: true ,
                   showtextarea: true
    })
    this.checkbook();
    // console.log(sItem.paid);
  
  },
  /**
  * 获取客户信息
  */
  getUserInfo() {

    wx.showLoading({
      title: 'loading...',
    });
    let _This = this;
    let pdata = {
      customerId: _This.data.customerId||"",
    };
    //console.log("pdta", pdata)
    wxRequest(wxaapi.customer.getcustomer.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        result.data.data.phoneNum = result.data.data.phoneNum ? result.data.data.phoneNum:result.data.data.wechatMobile;
        _This.setData({
          customerInfo: result.data.data,
        });
     //   _This.fClueDetail();
      } else {
        // console.log(result);
      }
      wx.hideLoading();
    });
  },
  /**
   * 获取用户预约信息
   */
  fGetAppointment() {
   
    let _This = this;
    let pdata = {
      //id:189,
      id: _This.data.appointmentId
    };
    //_This.data.appointmentId
    //console.log("pdata----1111--->", pdata);
    wxRequest(wxaapi.appointment.detail.url,pdata).then(function (result) {
      // console.log("booking==00000--appointment===>", result, typeof(result.data.data));
      let appointmentTime = result.data.data.appointmentTime;
      //console.log("appointmentTime----->", appointmentTime);
      let remark = result.data.data.remark; 
      let projectNames = result.data.data.projectNames; 
      let products = [];
      let sSelects=[];
      let ostatus = result.data.data.status;
      if (projectNames){
      projectNames.forEach(function(item){
       // console.log("item",item);
        let product = {};
        product.iname = item.projectName;
        product.itemid = item.projectCode;
        products.push(product);
        sSelects.push(item.projectCode)
      });}else{
       // console.log("proNameesle")
      }
     // console.log("product", products)
      if (result.data.code == 0) {
       
        //console.log("appointment=====result====",result);
        result.data.data = typeof (result.data.data) == "object" ? result.data.data : {};
      //  console.log("result.data.data ", result.data.data )
        _This.setData({
          status: ostatus,
          sSelect: sSelects,
          clueRemark: remark,
          arrData: products,          
          oAppointment: result.data.data || {},
          bdate: appointmentTime ? cutil.formatTime(appointmentTime, "yyyy-MM-dd") : _This.data.nextdate,
          btime: appointmentTime ? cutil.formatTime(appointmentTime, "hh:mm") : "10:00",

        });
        if (_This.data.clueStatus == 5) {
          _This.setData({
            status: 1
          });
        }
       // console.log("status", _This.data.status)
        _This.checkbook();
      } else {
        // console.log(result);
      }
    });
    //console.log("appointment----", _This.data.oAppointment)
    //console.log("status",this.data.status)
  },
  /**
    * 提交预约信息
    */
  fSubmitData() {
    let _This = this;
    let bookDate = _This.data.bdate + " " + _This.data.btime;
   // let Bookdate = Date.parse(new Date(bookDate));
    // wx.showLoading({
    //   title: '提交中...'
    // })
    //console.log("user data---customerInfo---", _This.data.customerInfo);
    // if (_This.data.bdate == "" || _This.data.btime == "" || !_This.data.customerInfo.name || _This.data.customerInfo.name == "") {
    //   console.log("_This.data.bdate----->", _This.data.bdate);
    //   wx.hideLoading();
    //   return false;
    // }
    let pCodes = _This.data.sSelect;
    //console.log("pCodes", _This.data.sSelect);
    let aTime = cutil.str2Date(bookDate).valueOf();
   // console.log("aTime---------->", aTime);
    let pdata = {
      consultUnId: _This.data.oUserInfo.unionId,
      customerId: _This.data.customerId,
      clueId: _This.data.clueId,
      appointmentTime: aTime,
      projectCodes: pCodes,
      remark: _This.data.clueRemark,
    };

    //console.log("=======pdata============", pdata);

    // 客户更新
    let userupdate = {
      id: _This.data.customerInfo.id,
      phoneNum: _This.data.bcustomerInfo.phoneNum,
      name: _This.data.bcustomerInfo.name,
      wechatNum: _This.data.customerInfo.wechatNum
    };
    //console.log("userupdatep----", userupdate);
    wxRequest(wxaapi.customer.update.url, userupdate).then(function (updateResult) {
      //console.log("update customer====>", updateResult);
      return updateResult;
    }).then(function (updateResult) {
      if (updateResult.data.code == 0) {
        wxRequest(wxaapi.appointment.send.url, pdata).then(function (result) {
          console.log("result.data---appointment-->----------", result.data);
          if (result.data.code == 0) {
            let oAppointment = _This.data.oAppointment;
            oAppointment.status = 1;
            _This.setData({
              status:1,
              oAppointment: oAppointment,
              reserveId: result.data.data
            });
            
            wx.showToast({
              title: '预约成功',
              icon: 'success',
              duration: 2000
            });
            clearTimeout(timere);
            var timere = setTimeout(function () {
              wx.navigateTo({
                url: '../../index/home'
              });
            }, 3000);
            // wx.hideLoading();
          } else {

            wx.showModal({
              title: 'Sorry',
              content: result.data.msg,
              success: function (res) {
                if (res.confirm) {
                 
                } else if (res.cancel) {
           
                }
              }
            }); 
          }
        });
      } else {
        wx.hideLoading();
       //console.log(updateResult);
      }
    });
  },
  
})