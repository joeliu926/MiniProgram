const wxRequest = require('../utils/js/wxRequest.js');
const wxaapi = require('./wxaapi.js');
var oCustom= {
   touser :"",
   msgtype:"text",
   text:
     {
      content:""
     }
}
var fSendWxMsg = function (cstUid,msgContent) {
  var pdata = { unionid:cstUid };
  wxRequest(wxaapi.user.userinfo.url, pdata).then(function (result) {
    //console.log("tool-000000000000000000000000===>", result);
    var oData = {
      touser: result.data.data.wxOpenId,
      msgtype: "text",
      text:
      {
        content: msgContent
      }
    }

    return wxRequest(wxaapi.wx.msg.sendmessage.url, oData);
  }).then(result => {
    console.log("tool send msg result-----", result);
  });
};
module.exports={
  custom: oCustom,
  fSendWxMsg: fSendWxMsg
}