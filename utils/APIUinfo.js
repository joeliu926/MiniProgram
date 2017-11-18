var uinfo=function(unionid,callback){
  wx.request({
    url: "https://27478500.qcloud.la/wxa/user/userinfo",
    method: "POST",
    data: { unionid: unionid},
    header: {
      'Content-Type': 'application/json'
    },
    success: function (result) {
       callback(result);
    }
  });
};

module.exports = {
  uinfo: uinfo
}