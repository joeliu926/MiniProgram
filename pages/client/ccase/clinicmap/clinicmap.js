Page({
  data: {
    logs: [],
    //longitude: "",
    //latitude: "",
    mapHeight:"",
  markers: [{
    iconPath: "../../../../public/images/red-local-icon.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 20,
      height: 40
    }]
  },
  onLoad: function (options) {
    let _This = this;
    let coordinate = options.coordinate;
    let address = options.address;
    let clinicName = options.clinicName;

    let  longitude = parseFloat(coordinate.split(",")[0]);
    let latitude= parseFloat(coordinate.split(",")[1]);

    console.log("options----->", options, latitude, longitude);
    let markers = _This.data.markers;
    markers[0].latitude = latitude;
    markers[0].longitude = longitude;
      
    _This.setData({
      latitude: latitude,
      longitude: longitude,
      markers: markers,
      clinicName: clinicName,
      address:address
    });
    wx.getSystemInfo({
      success:function(result){
        console.log("system info------->", result);
        _This.setData({
          mapHeight: (result.windowHeight-100)
        });
      }
    });


  },
  getPhoneNumber(e) {
    console.log("------", e);
    let encryptedData = e.detail.encryptedData;
    let iv = e.detail.iv;
    if (!encryptedData) {
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
      console.log("resAll----->", resAll);
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
