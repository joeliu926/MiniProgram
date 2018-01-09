const wxaapi = require('../../public/wxaapi.js');
const wxRequest = require('../../utils/js/wxRequest.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showicon: false,
    phonenum: "",
    customerList: [],
    autoFocus: false,
    selectItem: [{ id: 1, text: '智能推荐', val: true }, { id: 2, text: '其它', val: false }],
    moreItem: ['编辑联人', '关闭'],
    menuType: true,
    culeList1: [],
    culeList: [{
      id: 0,
      name: '客户护理',
      desc: '理线双眼皮，开内角拉，定点双眼波',
      type: '现场咨询',
      disp: ''
    },
    {
      id: 1,
      name: '客户护理',
      desc: '理线双眼皮，开内角拉，定点双眼波',
      type: '现场咨询',
      disp: ''
    },
    {
      id: 2,
      name: '客户护理',
      desc: '理线双眼皮，开内角拉，定点双眼波',
      type: '现场咨询',
      disp: ''
    },
    {
      id: 3,
      name: '客户护理',
      desc: '理线双眼皮，开内角拉，定点双眼波',
      type: '现场咨询',
      disp: ''
    },
    {
      id: 4,
      name: '客户护理',
      desc: '理线双眼皮，开内角拉，定点双眼波',
      type: '现场咨询',
      disp: ''
    },
    {
      id: 5,
      name: '客户护理',
      desc: '理线双眼皮，开内角拉，定点双眼波',
      type: '现场咨询',
      disp: ''
    },
    {
      id: 6,
      name: '客户护理',
      desc: '理线双眼皮，开内角拉，定点双眼波',
      type: '现场咨询',
      disp: ''
    },
    {
      id: 7,
      name: '客户护理',
      desc: '理线双眼皮，开内角拉，定点双眼波',
      type: '现场咨询',
      disp: ''
    },
    {
      id: 8,
      name: '客户护理',
      desc: '理线双眼皮，开内角拉，定点双眼波',
      type: '现场咨询',
      disp: ''
    }
    ],
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
      _This.getProjectList();
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
  selectType(params) {
    var dataset = params.currentTarget.dataset;
    this.data.selectItem.forEach(item => {
      if (item.id == dataset.id) {
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

        break;
      case "3":
        this.setData({
          menuType: false
        });
        break;

    }
  },
  bindPickerChange(params) {
    console.log('params', params);

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
  fInputSearch: function (e) {
    if (e.detail.value.length > 0) {
      this.setData({
        showicon: true,
        phonenum: e.detail.value
      });
    } else {
      this.setData({
        showicon: false,
        phonenum: ""
      });
    }
    this.getProjectList();
  },
  fClearData: function () {
    this.setData({
      showicon: false,
      phonenum: ""
    });
    this.getProjectList();
  },
  fNavCase(e) {
    var _This = this;
    var dataset = e.currentTarget.dataset;
    wx.navigateTo({
      url: '../projectcase/casetrail/casetrail?consultingId=' + dataset.consultationid + '&iname=' + dataset.iname + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + dataset.productcode
    });

    /*  wx.navigateTo({
        url: '../pcase/pcase?consultationId=' + dataset.consultationid + '&iname=' + dataset.iname + '&cstUid=' + _This.data.oUInfo.unionId + '&productCode=' + dataset.productcode
      });*/
  },
  fAddNew: function () {
    wx.navigateTo({
      url: '../projectcase/projectcase',
    })
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
      mobile: _This.data.phonenum || "",
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
   * 验证用户信息
   */
  fGetCUserInfo(unionid) {
    var _This = this;
    let pdata = { unionid: unionid };
    wxRequest(wxaapi.user.userinfo.url, pdata).then(function (result) {
      if (result.data.code != 0 || result.data.data.type != "1") {
        /*  _This.setData({
            showData: false
          });
          */
      }
    });
  }
})