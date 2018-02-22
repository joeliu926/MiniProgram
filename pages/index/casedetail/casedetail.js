const event = require('../../../public/js/wxEvent.js'); //事件上报相关参数
const wxaapi = require('./../../../public/wxaapi.js');//api地址参数
const wxRequest = require('./../../../utils/js/wxRequest.js'); //请求参数
const wxPromise = require('./../../../utils/js/wxPromise.js');//promise信息
Page({
  /**
   * 页面的初始数据
   */
  data: {
    aCaseList: [],
    itemLeft: 0,//左侧位置
    aItemLeft: {},//左侧位置对象
    caseCount: 4,//案例总数
    itemTop: 20,//顶部位置
    oUserInfo: {}, //当前用户信息
    aCaseId: 0,//案例ID
    caseList: [],
    bfimgurls:[],
    imgarr:[],
    oCaseDetail: {
      "id": "",
      "caseName": "",
      "doctor": {
      },
      "products": [
      ],
      "operationDate": "",
      "customerGender": "",
      "customerAge": "",
      "customerLogo": {
      },
      "beforePicture": {
      },
      "afterPicture": {
      },
      "contentList": [
      ]
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This = this;
    getApp().getUserData(function (uinfo) {
      //console.log("---ccase----user info=====>", uinfo);
      _This.setData({
        aCaseId: options.caseid || "",
        oUserInfo: uinfo,
        likeItem: "",
      });
      _This.fGetCaseDetailById()//获取案例
    });
  },
  /**
   * 术前术后图片的 缩略图展示
   */
  imgPreview(e) {
    var dataset = e.currentTarget.dataset;
    wx.previewImage({
      current: dataset.src,
      urls: e.currentTarget.dataset.urls
    })
  }, 
  /**
    * 浏览案例图片
    */
  imgPreviewCase(e) {
    let dataset = e.currentTarget.dataset;
    let pictures = dataset.pictures || [];
    let oPictures = [];
    pictures.forEach(item => {
      oPictures.push(item.url);
    });
    wx.previewImage({
      current: dataset.src,
      urls: oPictures
    })
  },
  /**
 * 通过案例ID获取案例详情
 */
  fGetCaseDetailById() {
    let _This = this;
    let aCaseId = _This.data.aCaseId;
    let pdata = {
      did: aCaseId
    };
    wxRequest(wxaapi.pcase.detail.url, pdata).then(function (result) {
      if (result.data.code == 0 && typeof (result.data.data) == "object") {
        let oCase = result.data.data;
        var imgurls=[];
        imgurls = imgurls.concat(oCase.beforePicture.url)
        imgurls = imgurls.concat(oCase.afterPicture.url);
        let aCaseList = _This.data.aCaseList;
        let contentList = result.data.data.contentList
        var arr = [];
        contentList.forEach(function(item){
          item.pictures.forEach(function(item){
              arr=arr.concat(item.url);
          })
          _This.setData({
            imgarr: arr
          })
        })
        _This.setData({
          oCaseDetail: oCase,
          aCaseList: aCaseList,
          bfimgurls: imgurls,
          
        });
      } else {
        console.log("case detail error----", result);
      }
    });
  },
  onReady: function () {
  },
})