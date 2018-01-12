//logs.js
const util = require('../../utils/js/util.js')
const wxaapi = require('./../../public/wxaapi.js');
const wxRequest = require('./../../utils/js/wxRequest.js');
const wxPromise = require('./../../utils/js/wxPromise.js');

Page({
  data: {
    logs: [],
    longitude:"",
    latitude:""


  
  },
  onLoad: function () {
   /*  this.setData({
      logs: (wx.getStorageSync('logs') || []).map(log => {
        return util.formatTime(new Date(log))
      })
    });*/
    //wx.clearStorage();
let _This=this;

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {

       console.log("res---------->",res);

        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy
        _This.setData({
          latitude: latitude,
          longitude: longitude
        });
      }
    })


  },
  click(){
    wx.previewImage({
      current: dataset.src,
      urls: [dataset.src]
    })
  }
  ,
  getPhoneNumber(e){
    console.log("------",e);
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    if (!encryptedData){
      return false;
    }
////////////////////////////////////////////
    let sessionKey = "";
    wxPromise(wx.login)().then(result => {
      let ucode = result.code;
      return wxRequest(wxaapi.unionid.code.url, { code: ucode });
    }).then(resSession => {
      sessionKey = resSession.data.session_key;
      return sessionKey;
      }).then(sessionKey => {
        console.log("sessionKey----->", sessionKey);
      var postData = {
        encryptedData: encryptedData,
        sessionKey: sessionKey, iv: iv
      };
      return wxRequest(wxaapi.unionid.userinfo.url, postData);
    }).then(resAll => {
        console.log("resAll----->",resAll);
    });

///////////////////////////////////////////
  },

  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  }

})
