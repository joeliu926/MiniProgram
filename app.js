const wxaapi = require('./public/wxaapi.js');
const wxRequest = require('./utils/js/wxRequest.js');
const wxPromise = require('./utils/js/wxPromise.js');
App({
  onLaunch: function (options) {
    console.log("onlaunch------>", options);
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
 let _This=this;
   if (this.globalData.userInfo&&this.globalData.userInfo.unionId){
     if (callback) {
      // console.log("exist-------->");
       callback(this.globalData.userInfo);
     }
     return false;
   };
  // console.log("data not exist------>");
   _This.fGetSessionKey(true,function (sessionKey){
     //console.log("sessionKey------>", sessionKey);
     _This.fAuthUserData(sessionKey).then(resAll => {
       //console.log("resAll------>", resAll);
       if (!resAll){
         callback({});
         return false;
       }
       getApp().globalData.userInfo = resAll.data.userinfo;
       if (callback) {
        // console.log("auth----end---", resAll.data.userinfo);
         callback(resAll.data.userinfo);
       }
     });
   });

 },
 /**
  * 用户授权用户信息
  */
 fAuthUserData(sessionKey){
   let _This=this;
  return wxPromise(wx.getUserInfo)().then(resUserInfo => {
     //console.log("----------resUserInfo-----------", resUserInfo);
     if (resUserInfo.errMsg.indexOf("ok") < 0) {
      let authData={
        title: '微信授权',
        content: '为能正常使用小程序，请授权您的公开信息(昵称、头像等)',
        confirmText: "去授权"
      };
      wxPromise(wx.showModal)(authData).then(ares=>{
         if (ares.confirm) {
           wxPromise(wx.openSetting)().then(settingResult => {
             if (settingResult.authSetting["scope.userInfo"]){
               getApp().globalData.reauth=true;
             }
             return _This.fAuthUserData(sessionKey);
           });
         } else {
           console.log("user cancel------");
           //return _This.fAuthUserData(sessionKey);
         }
       });
     }else{
       var encryptedData = resUserInfo.encryptedData;
       var iv = resUserInfo.iv;
       var postData = {
         encryptedData: encryptedData,
         sessionKey: sessionKey, iv: iv
       };
       return wxRequest(wxaapi.unionid.userinfo.url, postData);
     }
   })
 },
 /**
  * 获取sessionKey
  */
 fGetSessionKey: function (firstType,callback){
   let _This =this;
   let sessionKey=getApp().globalData.sessionKey;
   wxPromise(wx.checkSession)().then(result => {
     //console.log("checkout sessioon--------->",result);
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