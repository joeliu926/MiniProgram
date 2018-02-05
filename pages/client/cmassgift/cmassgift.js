const event = require('../../../public/js/wxEvent.js');
const tools = require('../../../utils/js/util.js');
const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
const wxPromise = require('../../../utils/js/wxPromise.js');//promise信息
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oGift:{},//礼品对象
    aGiftList:["11","22","33"],//礼品列表
    isShowMask:false,//显示授权手机号码提示框
    oUserInfo:{},//当前用户信息
    iTop:false,//向上移动
    currentRecoder:{name:"张雪勇",image:""},//当前的弹框
    aAuthRecoder: [{ name: "AAAA", image: "" }, { name: "BBBB", image: "" }, { name: "CCCC", image: "" }],//所有授权手机人
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    current: 0,//图片当前页
    totalPic: 1,//图片总数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This=this;
    getApp().getUserData(function (uinfo) {
      //console.log("uinfo------------->", uinfo);
      _This.setData({
        oUserInfo: uinfo,
        giftid: options.giftid||8,
        cstUid: options.cstUid,
        consultationId: options.consultationId,
        options: options
      });

      _This.fGiftDetail();

    });
 
 let mType=false;
 let i=1;
 let aLength = _This.data.aAuthRecoder.length||1;
 setInterval(function(){
   mType=!mType;
   let citem = _This.data.aAuthRecoder[i%aLength];
   _This.setData({
     iTop: mType,
     currentRecoder: citem
   }); 
   //console.log("1111--i--mType------>", mType);
   if (!mType){
     console.log("i--mType------>", mType);
     //console.log("---------------------");
     mType = !mType;
     _This.setData({
       iTop: mType
     });
   } 
 
   i++;
 },3000);

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
     let pdata={
       clueId :"",
       consultUnId: "",
       customerUnId : "",
       giftId:"",
       giftName:"",
       sessionId:"",
       wechatMobile: "",
     }
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
  /**
   * 获取礼品详情
   */
  fGiftDetail(){
    let _This = this;
    let pdata = {
      id: _This.data.giftid
    };
    //console.log("post data--->", pdata);
    wxRequest(wxaapi.gift.giftdetail.url, pdata).then(function (result) {
      //console.log("get giftdetail --->", result);
      if (result.data.code == 0) {
        _This.setData({
          oGift: result.data.data,
          totalPic: result.data.data.giftPictures.length
        });
      }
    });
  },
  /**
   * 获取领取详情
   */
  fGetReceiveDetail(){
     let _This = this;
     let pdata = {
       sessionId: _This.data.sessionId,
       customerUnId: _This.data.oUserInfo.unionId,
       consultUnId: _This.data.cstUid
     };
     //console.log("post data--->", pdata);
     wxRequest(wxaapi.activityrecord.getdetail.url, pdata).then(function (result) {
        console.log("activityrecord iftdetail --->", result);
       if (result.data.code == 0) {
         _This.setData({
          // oGift: result.data.data,
         });
       }
     });
   },


  /**
   * 切换改变
   */
  fSwiperChange(e){
    this.setData({
      current:e.detail.current
    });
  },
  /**
   * 立即领取formId
   */
  fFormRightNow(e){
    let _This=this;
    console.log("-------right now-------",e);
    _This.setData({
      isShowMask: true
    });
  },
  /**
   * 关闭授权手机
   */
  fClose(){
    let _This = this;
    _This.setData({
      isShowMask: false
    });
  },
  /**
   * 授权获取手机号码
   */
  getPhoneNumber(e) {
    let _This = this;
    _This.setData({
      isShowMask: false
    });
    wx.showLoading({
      title: '授权中...',
    });

   wx.navigateTo({
     url: 'giftsuccess/giftsuccess',
   })


    console.log("encryptedData----->", e);
    let eDetail = e.detail;
    if (!eDetail.encryptedData) {
      wx.hideLoading();
      return false;
    }
    eDetail.times = 0;
    _This.fAuthorization(eDetail, function (resPhone) {
      console.log("resPhone--------->", resPhone);
      if (isShowMask){
   
      }
      wx.hideLoading();
    });
  },
  /**
* 用户授权 eDetail用户授权返回对象
*/
  fAuthorization(eDetail, callback) {
    let _This = this;
    getApp().fGetSessionKey(false, function (sessionKey) {
      var postData = {
        encryptedData: eDetail.encryptedData,
        sessionKey: sessionKey,
        iv: eDetail.iv
      };
      wxRequest(wxaapi.unionid.userinfo.url, postData).then(resPhone => {
        if (resPhone.data.userinfo) {
          _This.setData({
            agree: 1
          });
          callback && callback(resPhone.data.userinfo.phoneNumber);
        } else {
          callback && callback(false);
        }
      });
    });
  },


})