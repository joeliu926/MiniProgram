const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
var touchDotX = 0;//触摸时的原点
var touchDotY = 0;//触摸时的原点
Page({

  /**
   * 页面的初始数据
   */
  data: {
     oOptions:{},//传入的参数
    oUserInfo:{},//当前用户信息
     postHeight:0,//海报外框的高度
     postImageHeight:0,//海报图片的高度
     selectContentHeight: 275,//下部选择框高度
     selectImgHeight:200,//下部图片外框高度
     selectHeight:128,//选择框高度
     isDelay:false,//是否延迟滑动
     aCategoryList:[],//获取分类列表
     aPostList:[],//获取海报列表
     pageNo:1,//页数
     pageSize:100,//每页数量
     oClinic:{},//诊所信息
     currentPoster:"",//当前的海报url
     categoryId: "",//当前分类id
     postId:"",//海报id
     categoryName:"",//当前的分类名称
     isShowMask:false// 是否显示弹出框
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This=this;
    console.log("--------options----------",options);

    getApp().getUserData(function (oUserInfo) {
      _This.setData({
        oUserInfo: oUserInfo,
        oOptions: options
      });
      _This.fGetCategoryList();//获取分类列表
      _This.fGetClinicDetail();//获取诊所信息
    });

    wx.getSystemInfo({
      success: function (result) {
        //console.log("-=-=-=-=-=-=-=-=-",result);
        let postHeight = result.windowHeight;
        let windowWidth = result.windowWidth;
        //console.log("postHeight--------->", postHeight);
        let postImageHeight=parseInt(windowWidth*850/750);
        //console.log("postImageHeight------>", postImageHeight);
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
    wx.showLoading({
      title: 'loading...',
    });
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
      wx.hideLoading();
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
    wx.showLoading({
      title: 'loading...',
    });
    wxRequest(wxaapi.posterinfo.pagelist.url, postData).then(function (result) {
      if (result.data.code == 0) {
        let dataList = result.data.data.list;
        _This.setData({
          aPostList: dataList
        });
        if(!e){
          _This.setData({
            currentPoster: dataList[0].fileUrl,
            postId: dataList[0].id
          });
        }
      }
      wx.hideLoading();
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
    let oOptions = _This.data.oOptions;
    let caseIds = oOptions.caseIds||"";
    let cstUid = oOptions.cstUid||"";
    let itemid = oOptions.itemid||"12";
    let consultationId = oOptions.consultationId||"";
    let shareEventId = oOptions.shareEventId||"";
    let path = `pages/client/ccase/ccase?caseIds=${caseIds}&cstUid=${cstUid}&itemid=${itemid}&consultationId=${consultationId}&shareEventId=${shareEventId}`;
    let scene = `${caseIds},${cstUid},${itemid},${consultationId},${shareEventId}`;
    scene = `${consultationId}`;
    scene = encodeURI(scene);
    console.log("scene--------------", scene);
        path="pages/test/test";
    let pdata = {
        //path: "pages/test/test?query=1",
        path: path,
        width: 200,
        scene: scene//
    }
    console.log("wxaapi.wxaqr.genwxaqrcode.url----->", wxaapi.wxaqr.genwxaqrcode.url, pdata);
    wxRequest(wxaapi.wxaqr.genwxaqrcode.url, pdata).then(function (result) {
      console.log("fGetQrcode info ----->", result);
      if (result.data.code == 0) {
        _This.setData({
          qrCodeUrl: result.data.data,
         // currentPoster: result.data.data
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
    let postId = e.target.dataset.postid;
    if(purl){
      _This.setData({
        currentPoster: purl,
        postId:postId
      });
    };
    wx.pageScrollTo({
      scrollTop: 0
    });
  },
  /**
   * 保存完成之后的弹出框
   */
  fKnowShare(){
    this.setData({
      isShowMask:false
    });
  },
  /**
   * 保存海报图片
   */
  fSavePoster(){
    let _This = this;
    let pdata = {
      tmpid: '1',
      content: {
        postPic: _This.data.currentPoster,
        logo: _This.data.oClinic.logo,
        clinicName:_This.data.oClinic.name,
        qrcode: _This.data.qrCodeUrl
      }
    }
    wxRequest(wxaapi.posterinfo.createposter.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
         // currentPoster:dns+result.data.data.url
        });
        _This.fDownLoadPic(result.data.data);//保存图片
      }
    })
  },
  /**
   * 保存图片到本地
   */
  fDownLoadPic(oImg){
    let _This=this;
    let imgUrl = wxaapi.wxaqr.gConfig.route + oImg.url;
    wx.downloadFile({
      url: imgUrl,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            //console.log("-----------------------", res);
            _This.setData({
              isShowMask: true
            });
            _This.fDeletePosterImg(oImg.id);
          },
          fail: function (res) {
            //console.log("---------error--------------", res)
          }
        })
      },
      fail: function () {
        console.log('fail')
      }
    });
  },
  /**
   * 删除保存的海报图片
   */
  fDeletePosterImg(imgid){
    let _This = this;
    let pdata = {
      imgid: imgid
    }
    wxRequest(wxaapi.posterinfo.deleteposter.url, pdata).then(function (result) {
      if (result.data.code == 0) {   
      }
    })
  },
  /**
   * 还原滑动
   */
  fBottomRevert(){
     let _This=this;
      _This.setData({
        selectContentHeight:275,
      });
      setTimeout(function(){
        _This.setData({
          selectImgHeight: 200
        });
      },1000);
  },
  /**
   * 底部滑动开始
   */
  fTouchStart(e){
     touchDotX = e.touches[0].pageX; // 获取触摸时的原点touchDotX
     touchDotY = e.touches[0].pageY; // 获取触摸时的原点touchDotY
     this.setData({
       isDelay: false,
       selectImgHeight: 375
     });
  },
  /**
   * 底部滑动
   */
  fTouchMove(e){
  let _This=this;
    let tX = (e.touches[0].pageX - touchDotX);
    let tY = (e.touches[0].pageY - touchDotY);
    let selectContentHeight = _This.data.selectContentHeight - tY;
    if (Math.abs(tY)>20 && Math.abs(tX) < Math.abs(tY)){
      selectContentHeight = selectContentHeight > 450 ? 450 : selectContentHeight;
      selectContentHeight = selectContentHeight<275 ? 275 : selectContentHeight;
      _This.setData({
        selectContentHeight: selectContentHeight,
      });
    }else {

    }
  },
  /**
   * 滑动结束
   */
  fTouchEnd(e){
    let _This = this;
    let tX = (e.changedTouches[0].pageX - touchDotX);
    let tY = (e.changedTouches[0].pageY - touchDotY);
    let selectContentHeight = _This.data.selectContentHeight;
    if (Math.abs(tY) > 20 && Math.abs(tX) < Math.abs(tY)) {
      selectContentHeight=tY>0?275:450;
      _This.setData({
        selectContentHeight: selectContentHeight
      });
    }
    if (selectContentHeight<400){
      this.setData({
        selectImgHeight: 200
      });
    }
    this.setData({
      isDelay: true
    });

  }
  

})