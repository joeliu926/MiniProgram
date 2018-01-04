const wxaapi = require('./../../../public/wxaapi.js');
const wxRequest = require('./../../../utils/js/wxRequest.js');
const wxPromise = require('./../../../utils/js/wxPromise.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage:1,
    totalCount:1,
    caseList:["案例一","案例二","案例三"],
    detailInfo: {
      "doctorName": "",
      "contentList": [
        {
          "title": "术后20天",
          "description":"这是第一个的描述信息，一定要仔细去看",
          "definitionDate":"2017-11-12",
          "pictures": ["",""]
        },
        {
          "title": "术后25天",
          "description": "这是第二个的描述信息，一定要仔细去看，哎呀这个不错啊",
          "definitionDate": "2017-11-22",
          "pictures": ["", "", "", "11", "222"]
        },
        {
          "title": "术后30天",
          "description": "这是第三个的描述信息，一定要仔细去看，这个更好了，继续发展，你会看到变化",
          "definitionDate": "2017-11-30",
          "pictures": ["","",""]
        },
        {
          "title": "术后35天",
          "description": "这是第四个的描述信息，一定要仔细去看，这个是最后的，你看到了可以袭击决定怎么处理",
          "definitionDate": "2017-12-12",
          "pictures": ["", "11", "222", "11", "222"]
        }
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  let _This=this;
  _This.fGetCaseData();
    wx.getSystemInfo({
      success: function (res) {
        console.log("res---------->",res);
        _This.setData({
          clientHeight: res.screenHeight
        });
      }
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("-----selectorQuery-----");
    let _This=this;

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },

  fCloseMask(){
   this.setData({
     isFirstEnter:false
   });
  },
  fTakePhoto(){
    console.log("the doctor take photo--->");
  },
  fGetCaseData(){
    let _This = this;
    let caseCount = _This.data.detailInfo.contentList.length || 1;
    let countRate = parseInt(100 / caseCount);

  }
})