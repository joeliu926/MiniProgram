// pages/pcase/pcase.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      projectItem:[
        {
          projectName:"眼部整形",
          projectItem:[{
            name:"内开眼角",url:""
          },{
              name: "外开眼角", url: ""
          },{
              name: "双眼皮", url: ""
          },{
              name: "切开双眼皮", url: ""
          }, {
            name: "单眼皮", url: ""
          }, {
            name: "定点双眼皮", url: ""
          }]
        },{
          projectName: "鼻部整形",
          projectItem: [{
            name: "高鼻梁", url: ""
          }, {
            name: "矮鼻梁", url: ""
          }, {
            name: "大鼻子", url: ""
          }, {
            name: "小鼻子", url: ""
          }, {
            name: "其他鼻子", url: ""
          }, {
            name: "others", url: ""
          }]
        },{
          projectName: "面部轮廓",
          projectItem: [{
            name: "左脸", url: ""
          }, {
            name: "右脸", url: ""
          }, {
            name: "额头", url: ""
          }, {
            name: "下巴", url: ""
          }, {
            name: "其他", url: ""
          }]
        }
      ],
      uicondata:"adsffsdf"
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
  selectItem:function(item){
   console.log(item.target.dataset.iname);
   wx.navigateTo({
     url: 'cdetail/cdetail',
   })
  },
  selectTitle:function(){
console.log("this is select title");
  }

})