Page({

  /**
   * 页面的初始数据
   */
  data: {
    bdate:"",
    btime:"",
    bookdate:"",
    value: [9999, 1, 1],
    multiArray: [['11', '11'], ['22', '222', '2222', '22222', '222222'], ['33', '333'], ['44', '444'], ['55', '55555']],
    multiIndex: [0, 0, 0,0,0]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
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
  fBooking:function(e){
 console.log(e.detail.value);
  },
  bindDateChange:function(e){
 console.log(e);
 this.setData({
   bdate:e.detail.value
   });
  },
  bindTimeChange: function (e) {
    console.log(e);
    this.setData({
      btime: e.detail.value
    });
  },
  bindChange: function (e) {
    const val = e.detail.value;
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
      day: this.data.days[val[2]]
    })
  },
  fSingleTrail(){
    console.log("go to single trail");
    wx.navigateTo({
      url: '../../singletrail/singletrail',
    })
  }
})