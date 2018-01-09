const wxaapi = require('../../public/wxaapi.js');
const wxRequest = require('../../utils/js/wxRequest.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showicon: false,
    searchName: "",
    cluereMark:"",
    clueClose:"",
    customerList: [],
    autoFocus: false,
    selectItem: [{ id: 0, text: '智能推荐', val: true }, { id: 1, text: '其它', val: false }],
    currentSelect:0,
    moreItem: ['编辑联人', '关闭'],
    menuType: true,
    shareList: [],
    culeList: [],
    oUInfo: {},
    showData: 0,
    sexitems: [
      { name: '男', value: 1 },
      { name: '女', value: 2, checked: 'true' }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.init) {
      // getApp().globalData.flag=false;
    }
    var _This = this;
    getApp().getUserData(function (result) {
      //console.log("loading use info=====>",result);
      _This.fGetCUserInfo(result.unionId);
      _This.setData({
        oUInfo: result
      });
      _This.getClueList(result.unionId,_This.data.searchName);
      _This.getShareList(result.unionId,_This.data.searchName);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    /*if (getApp().globalData.flag) {
      wx.navigateBack({
        delta: 1
      })
      getApp().globalData.flag = false;
      wx.navigateBack({
        delta: 1
      })
    } */
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu({});
    wx.hideNavigationBarLoading();
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
    //wx.reLaunch();
    this.getProjectList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    //console.log("this is bottom data");
    wx.showLoading({
      title: 'loading...',
    });
    setTimeout(function () {
      wx.hideLoading();
    }, 1000);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {

  },
  openItem(params) {
    var dataset = params.currentTarget.dataset;

    console.log('params', params);
    wx.navigateTo({
      url: './detail/cluedetail'
    })
  },
  closeSearch(params) {
    this.setData({
      showData: 0,
      autoFocus: false
    });
  },
  inputOver(params) {
    console.log('params', params);
  },
  moreOption(params) {
    console.log('params', params);
  },
  bookOption(params) {
    this.setData({
      showData: 3
    });
  },
  remarkOption(params) {
    this.setData({
      showData: 3
    });
  },
  searchClueinput(params){
    if (params.detail.value.length > 0) {
      this.setData({
        showicon: true,
        searchName: params.detail.value
      });
    } else {
      this.setData({
        showicon: false,
        searchName: ""
      });
    }
  },
  selectType(params) {
    var dataset = params.currentTarget.dataset;
    this.data.selectItem.forEach(item => {
      if (item.id == dataset.id) {
        this.currentSelect = dataset.id;
        item.val = true;
      }
      else {
        item.val = false;
      }
    });
    this.setData({
      selectItem: this.data.selectItem
    });
  },
  searchBtn() {
    this.setData({
      showData: 2,
      autoFocus: true
    });
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  menuClick(params) {
    switch (params.currentTarget.dataset.type) {
      case "1":
        this.setData({
          menuType: true
        });
        break;
      case "2":
        wx.navigateTo({
          url: '../projectcase/projectcase',
        });
        break;
      case "3":
        this.setData({
          menuType: false
        });
        break;
    }
  },
  bindPickerChange(params) {
    switch (params.detail.value) {
      case "0":
        this.setData({
          showData: 4
        });
        break;
      case "1":
        this.setData({
          showData: 5
        });
        break;
        break;
      case "2":

        break;
    }
  },
  fClearData: function () {
    this.setData({
      showicon: false,
      searchName: ""
    });
    this.getProjectList();
  },
  /**
   * 获取用户列表
   */
  getProjectList(unionId, mobile) {
    wx.showLoading({
      title: 'loading...',
    });
    let _This = this;
    let pdata = {
      unionId: _This.data.oUInfo.unionId || "",
      mobile: _This.data.searchName || "",
      pageSize: 10000
    };
    wxRequest(wxaapi.consult.list.url, pdata).then(function (result) {
      // console.log("load project info==>", result);
      if (result.data.code == 0) {
        _This.setData({ customerList: result.data.data.list });
      } else {
        console.log("load project info error==>", result);
      }
      wx.hideLoading();
    });
  },
  /**
   * 获取线索列表
   */
  getClueList(unionId, name) {
    wx.showLoading({
      title: 'loading...',
    });
    let _This = this;

    console.log('_This.currentSelect', _This.currentSelect);
    let pdata = {
      userUnionId: unionId || "",
      group: _This.data.currentSelect,
      searchName: '',
      pageNo:1,
      pageSize:10
    };
    wxRequest(wxaapi.index.cluelist.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({ clueList: result.data.data.list });
      } else {
        console.log("load project info error==>", result);
      }
      wx.hideLoading();
    });
  },

  /**
   * 获取分享列表
   */
  getShareList(unionId, name) {
    wx.showLoading({
      title: 'loading...',
    });
    let _This = this;
    let pdata = {
      consultantUnionid: unionId || "",
      pageNo: 1,
      pageSize: 10
    };
    wxRequest(wxaapi.index.sharelist.url, pdata).then(function (result) {
      // console.log("load project info==>", result);
      if (result.data.code == 0) {
        _This.setData({ customerList: result.data.data.list });
      } else {
        console.log("load project info error==>", result);
      }
      wx.hideLoading();
    });
  },
  /**
   * 验证用户信息
   */
  fGetCUserInfo(unionid) {
    var _This = this;
    let pdata = { unionid: unionid };
    wxRequest(wxaapi.user.userinfo.url, pdata).then(function (result) {
      if (result.data.code != 0 || result.data.data.type != "1") {
         _This.setData({
            showData: false
          });
      }
    });
  }
})