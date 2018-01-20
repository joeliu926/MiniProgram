const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oUserInfo:{},//当前用户信息
     postHeight:0,//海报外框的高度
     postImageHeight:0,//海报图片的高度
     selectHeight:128,//选择框高度
     aCategoryList:[],//获取分类列表
     aPostList:[],//获取海报列表
     pageNo:1,//页数
     pageSize:100,//每页数量
     oClinic:{},//诊所信息
     currentPoster:"",//当前的海报url
     categoryId: "",//当前分类id
     categoryName:""//当前的分类名称
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This=this;
    //console.log("------------------",options);

    getApp().getUserData(function (oUserInfo) {
      _This.setData({
        oUserInfo: oUserInfo
      });
      _This.fGetCategoryList();//获取分类列表
      _This.fGetClinicDetail();//获取诊所信息
    });

    wx.getSystemInfo({
      success: function (result) {
        console.log("-=-=-=-=-=-=-=-=-",result);
        let postHeight = result.windowHeight;
        let windowWidth = result.windowWidth;
        //console.log("postHeight--------->", postHeight);
        let postImageHeight=parseInt(windowWidth*850/750);
        console.log("postImageHeight------>", postImageHeight);
        _This.setData({
          postHeight: postHeight,
          postImageHeight: postImageHeight
        });
      }
    });

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
  /**
   * 获取分类列表
   */
  fGetCategoryList(){
    let _This=this;
    let postData = {
      userUnionId: _This.data.oUserInfo.unionId
    };
    wxRequest(wxaapi.postercategory.list.url, postData).then(function (result) {
      if (result.data.code == 0&&result.data.data.length>0) {
        _This.setData({
          aCategoryList:result.data.data,
          categoryId: result.data.data[0].id
        });
        _This.fSelectCate();
      } 
    });
  },
  /**
   * 选择分类
   */
  fSelectCate(e){
    let _This = this;
    if(e){
      _This.setData({
        categoryId: e.target.dataset.categoryid
      });
    }
    let postData = {
      userUnionId: _This.data.oUserInfo.unionId,
      categoryId: _This.data.categoryId || 3,
      pageNo: _This.data.pageNo,
      pageSize: _This.data.pageSize
    };
    wxRequest(wxaapi.posterinfo.pagelist.url, postData).then(function (result) {
      if (result.data.code == 0) {
        let dataList = result.data.data.list;
        _This.setData({
          aPostList: dataList
        });
        if(!e){
          _This.setData({
            currentPoster: dataList[0].fileUrl
          });
        }
      }
    });
  },
  /**
* 获取诊所详情信息
*/
  fGetClinicDetail() {
    let _This = this;
    let pdata = {
      unionId: _This.data.oUserInfo.unionId //咨询师unionid
    };
    wxRequest(wxaapi.clinic.detail.url, pdata).then(function (result) {
      //console.log("clinic info ----->", result);
      if (result.data.code == 0) {
        _This.setData({
          oClinic: result.data.data
        });
      }

      _This.fGetQrcode();
    });
  },
  /**
   * 获取小程序二维码
   */
  fGetQrcode(){
    let _This = this;
    let pdata = {
        path: "pages/home/home?query=1",
        width: 430,
        scene: 123
    }
    wxRequest(wxaapi.wxaqr.genwxaqrcode.url, pdata).then(function (result) {
      console.log("fGetQrcode info ----->", result);
      if (result.data.code == 0) {
        _This.setData({
          qrCodeUrl: result.data.data
        });
      }
    })
  },
  /**
   * 选择海报图片
   */
  fSelectPosterImg(e){
    let _This=this;
    let purl=e.target.dataset.src;
    if(purl){
      _This.setData({
        currentPoster: purl
      });
    }
  },
  /**
   * 保存海报图片
   */
  fSavePoster(){
    let _This = this;
    let dns = wxaapi.wxaqr.gConfig.route; 
    let pdata = {
      tmpid: '1',
      content: {
        postPic: _This.data.currentPoster,
        logo: _This.data.oClinic.logo,
        clinicName:_This.data.oClinic.name,
        qrcode: _This.data.qrCodeUrl
      }
    }
    console.log("pdata---------", pdata);
    wxRequest(wxaapi.posterinfo.api.url, pdata).then(function (result) {
      console.log("api image ----->", result, dns);
      if (result.data.code == 0) {
        _This.setData({
          currentPoster:dns+result.data.data.url
        });

        wx.downloadFile({
          url: dns+result.data.data.url,
          success: function (res) {
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function (res) {
                console.log("-----------------------",res);
              },
              fail: function (res) {
                console.log("---------error--------------", res)
              }
            })
          },
          fail: function () {
            console.log('fail')
          }
        });



      }
    })
  }
})