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
       cstUid: options.cstUid ||"oDOgS0kCV5its31fROZtbdqcpMAE"
     });
     this.fGetConsultDetail();
  },
  /**
   * 拨打电话
   */
  fMakePhone() {
    let _This = this;
    wx.makePhoneCall({
      phoneNumber: _This.data.oCstData.mobile
    })
  },
  /**
   * 复制微信号码
   */
  fCopyWeNum(){
    let _This=this;
    wx.setClipboardData({
      data: _This.data.oCstData.wxAccount,
      success: function (res) {
        wx.showToast({
          title: '复制微信号成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
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
      console.log("get consult detail result---->", result);
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