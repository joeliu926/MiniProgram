const wxRequest = require('../../utils/js/wxRequest.js');
const wxaapi = require('../wxaapi.js');
var fGetUserByUnionId = function (unionid, callback) {
  wx.request({
    url: wxaapi.user.userinfo.url,
    method: "POST",
    data: { unionid: unionid },
    header: {
      'Content-Type': 'application/json'
    },
    success: function (result) {
      //console.log("user info result===>",result);
      callback(result);
    }
  });
};
var fUserEvent=function(){

};

module.exports = {
  fGetUserByUnionId: fGetUserByUnionId,
  fUserEvent: fUserEvent
}