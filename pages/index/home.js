const wxaapi = require('../../public/wxaapi.js');
const wxRequest = require('../../utils/js/wxRequest.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showicon: false,
    searchName: "",
    cluereMark: "",
    clueClose: "",
    customerList: [],
    autoFocus: false,
    selectItem: [{ id: 0, text: '智能推荐', val: true }, { id: 1, text: '其它', val: false }],
    currentSelect: 0,
    moreItem: ['编辑联人', '关闭'],
    menuType: true,
    shareList: [],
    clueList: [],
    clueListOther: [],
    oUInfo: {},
    showData: 0,
    clueNo: 1,
    clueCount: 0,
    clueNoOther: 1,
    clueCountOther: 0,
    shareNo: 1,
    shareCount: 0,
    pageSize: 10,
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
      _This.getClueList();
      _This.getShareList();
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.menuType) {
      if (this.data.currentSelect) {
        if (this.data.clueNoOther * this.data.pageSize < this.data.clueCountOther) {
          wx.showLoading({
            title: 'loading...',
          });
          setTimeout(function () {
            wx.hideLoading();
          }, 1000);
          this.setData({
            clueNoOther: this.data.clueNoOther + 1
          });
          this.getClueList();
        }
      } else {
        if (this.data.clueNo * this.data.pageSize < this.data.clueCount) {
          wx.showLoading({
            title: 'loading...',
          });
          setTimeout(function () {
            wx.hideLoading();
          }, 1000);
          this.setData({
            clueNo: this.data.clueNo + 1
          });
          this.getClueList();
        }
      }
    }
    else {
      if (this.data.shareNo * this.data.pageSize < this.data.shareCount) {
        wx.showLoading({
          title: 'loading...',
        });
        setTimeout(function () {
          wx.hideLoading();
        }, 1000);
        this.setData({
          shareNo: this.data.shareNo + 1
        });
        this.getShareList();
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {

  },
  openItem(params) {
    var dataset = params.currentTarget.dataset;
    wx.navigateTo({
      url: './detail/cluedetail?id=' + dataset.obj.id
    });
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
    let pobj = params.target.dataset.obj;
  wx.navigateTo({
    url: `../projectcase/book/book?userId=${pobj.userId}&userUnionId=${pobj.userUnionId}&appointmentId=${pobj.appointmentId}&tenantId=${pobj.tenantId}&customerId=${pobj.customerId}&clueId=${pobj.id}`, });
  },
  remarkOption(params) {
    this.setData({
      showData: 3
    });
  },
  //搜索确定
  searchClueinput(params) {
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

    if (this.data.currentSelect) {
      this.setData({
        clueListOther: []
      });

    } else {
      this.setData({
        clueList: []
      });
    }
    this.getClueList();
    this.closeSearch();
  },

  //tab 选项卡
  selectType(params) {
    var dataset = params.currentTarget.dataset;
    this.data.selectItem.forEach(item => {
      if (item.id == dataset.id) {
        this.setData({
          currentSelect: dataset.id
        });
        item.val = true;
        // this.getClueList();
      }
      else {
        item.val = false;
      }
    });
    this.setData({
      searchName: "",
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
  //菜单点击
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
  //线索更多点击
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
  getClueList() {
    wx.showLoading({
      title: 'loading...',
    });
    let _This = this;
    let pdata = {
      userUnionId: _This.data.oUInfo.unionId || "",
      group: this.data.currentSelect,
      searchName: this.data.searchName,
      pageNo: this.data.currentSelect ? this.data.clueNo : this.data.clueNoOther,
      pageSize: this.data.pageSize
    };
    wxRequest(wxaapi.index.cluelist.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        let getArray = result.data.data.list;
        getArray.forEach(m => {
          let slist = [];
          m.productList.forEach((sm, index) => {
            if (sm.productName && slist.length < 4) {
              slist.push(sm);
            }
          });
          m.productList = slist;
        });
        if (_This.data.currentSelect) {
          _This.setData({ clueListOther: _This.data.clueListOther.concat(getArray) });
          _This.setData({ clueCountOther: result.data.data.count });
        } else {
          _This.setData({ clueList: _This.data.clueList.concat(getArray) });
          _This.setData({ clueCount: result.data.data.count });
        }
      } else {
        console.log("load project info error==>", result);
      }
      wx.hideLoading();
    });
  },

  /**
   * 获取分享列表
   */
  getShareList() {
    wx.showLoading({
      title: 'loading...',
    });
    let _This = this;
    let pdata = {
      consultantUnionid: _This.data.oUInfo.unionId || "",
      pageNo: this.data.shareNo,
      pageSize: this.data.pageSize
    };
    wxRequest(wxaapi.index.sharelist.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({ shareCount: result.data.data.count });
        let getArray = result.data.data.list;
        getArray.forEach(m => {
          let slist = [];
          m.casesName.forEach((sm, index) => {
            if (sm && slist.length < 2) {
              if (m.casesName.length > 1) {
                sm += '等';
              }
              slist.push(sm);
            }
          });
          m.casesName = slist;
          let plist = [];
          m.productsName.forEach((sm, index) => {
            if (sm && plist.length < 4) {
              plist.push(sm);
            }
          });
          m.productsName = plist;
        });
        _This.setData({ shareList: _This.data.shareList.concat(getArray) });
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