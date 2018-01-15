const wxaapi = require('./public/wxaapi.js');
const wxRequest = require('./utils/js/wxRequest.js');
const wxPromise = require('./utils/js/wxPromise.js');
App({
  onLaunch: function () {
    //this.getUserData();
  },
  globalData: {
   userInfo: null,
   flag: false, 
   sessionKey:"" 
  },
  /**
   * 获取用户登录信息
   */
 getUserData:function(callback){

   if (this.globalData.userInfo&&this.globalData.userInfo.unionId){
     if (callback) {
       console.log("exist-------->");
       callback(this.globalData.userInfo);
     }
     return false;
   };
   console.log("data not exist------>");
   this.fGetSessionKey(true,function (sessionKey){
     //console.log("sessionKey------>", sessionKey);
     wxPromise(wx.getUserInfo)().then(resUserInfo => {
       var encryptedData = resUserInfo.encryptedData;
       var iv = resUserInfo.iv;
       var postData = {
         encryptedData: encryptedData,
         sessionKey: sessionKey, iv: iv
       };
       return wxRequest(wxaapi.unionid.userinfo.url, postData);
     }).then(resAll => {
       getApp().globalData.userInfo = resAll.data.userinfo;
       if (callback) {
         callback(resAll.data.userinfo);
       }
     });
   });

 },
 /**
  * 获取sessionKey
  */
 fGetSessionKey: function (firstType,callback){
   let _This =this;
   let sessionKey=getApp().globalData.sessionKey;
   wxPromise(wx.checkSession)().then(result => {
     if (!firstType&&result.errMsg.indexOf("ok") > 0) {
       callback(sessionKey);
     } else {
       wxPromise(wx.login)().then(result => {
         let ucode = result.code;
         return wxRequest(wxaapi.unionid.code.url, { code: ucode });
       }).then(resSession => {
         getApp().globalData.sessionKey = resSession.data.session_key;
         sessionKey = resSession.data.session_key;
         callback(sessionKey);
       });
     }
   });
 } 
 
})