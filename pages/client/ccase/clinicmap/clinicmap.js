const wxaapi = require('./../../../../public/wxaapi.js');//api地址参数
const wxRequest = require('./../../../../utils/js/wxRequest.js'); //请求参数
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
    _This.setData({
      unionId: options.unionId
    });

    _This.fGetClinicDetail();
    wx.getSystemInfo({
      success:function(result){
        _This.setData({
          mapHeight: (result.windowHeight-100)
        });
      }
    });
  },
  /**
 * 获取诊所详情信息
 */
  fGetClinicDetail() {
    let _This = this;
    let pdata = {
      unionId: _This.data.unionId //咨询师unionid
    };
    wxRequest(wxaapi.clinic.detail.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
          oClinic: result.data.data
        });
        _This.fGetMapData();
      }
    });
  },
  /**
   * 生成地图数据
   */
  fGetMapData(){
    let _This = this;
    let oClinic = _This.data.oClinic;
    let longitude = parseFloat(oClinic.coordinate.split(",")[0]);
    let latitude = parseFloat(oClinic.coordinate.split(",")[1]);
    let markers = _This.data.markers;
    markers[0].latitude = latitude;
    markers[0].longitude = longitude;
    _This.setData({
      latitude: latitude,
      longitude: longitude,
      markers: markers
    });
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
