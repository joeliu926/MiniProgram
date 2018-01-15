const wxaapi = require('./../../../../public/wxaapi.js');//api地址参数
const wxRequest = require('./../../../../utils/js/wxRequest.js'); //请求参数
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cstUid:"",
    oCstData:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("options---->", options);
     this.setData({
       cstUid: options.cstUid
     });
     this.fGetConsultDetail();
  },

  /**
  * 获取咨询师详情
  */
  fGetConsultDetail() {
    let _This = this;
    let pdata = {
      unionid: _This.data.cstUid,
    };
    wxRequest(wxaapi.user.userinfo.url, pdata).then(function (result) {
      //console.log("get consult detail result---->", result);
      if (result.data.code == 0) {
         _This.setData({
           oCstData:result.data.data
         });
      } else {
        console.log("get consult detail info error----", result);
      }
    });
  },





})