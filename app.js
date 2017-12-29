const wxaapi = require('./public/wxaapi.js');
const wxRequest = require('./utils/js/wxRequest.js');
const wxPromise = require('./utils/js/wxPromise.js');
App({
  onLaunch: function () {
    this.getUserData();
  },
  globalData: {
   userInfo: null,
   flag: false  
  },
 getUserData:function(callback){
   if (this.globalData.userInfo&&this.globalData.userInfo.unionId){
     if (callback) {
       callback(this.globalData.userInfo);
     }
     return false;
   };
   let sessionKey="";
   wxPromise(wx.login)().then(result => {
     let ucode = result.code;
     return wxRequest(wxaapi.unionid.code.url, { code: ucode });
   }).then(resSession => {
      sessionKey = resSession.data.session_key;
     return wxPromise(wx.getUserInfo)();
   }).then(resUserInfo => {
     var encryptedData = resUserInfo.encryptedData;
     var iv = resUserInfo.iv;
     var postData = {
       encryptedData: encryptedData,
       sessionKey: sessionKey, iv: iv
     };
     return wxRequest(wxaapi.unionid.userinfo.url,postData);
   }).then(resAll => {
     getApp().globalData.userInfo = resAll.data.userinfo;
     if (callback) {
       callback(resAll.data.userinfo);
     }
   });

 }
})