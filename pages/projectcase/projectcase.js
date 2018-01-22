const wxaapi = require('../../public/wxaapi.js');
const wxRequest = require('../../utils/js/wxRequest.js');
Page({
  data: {
    isactive: false,
    isshow: false,
    projectItems: [],
    uicondata: "",
    oUserInfo: {},
    consultationId: "",
    jSelect: "",
    sSelect: [],
    arrData: [],
    selable: [],
    allarr: [],
    isShow: 'false',
    Show: 'false',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("options pcase-->", options);
    let _This = this;
    wx.showLoading({
      title: 'loading...',
    });
    _This.setData({
      consultationId: options.consultationId,
      jSelect: options.productCode
    });
    getApp().getUserData(function (uinfo) {
      uinfo && _This.getProjectList(uinfo.unionId);
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
    wx.hideShareMenu({});
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
   *   选择项目  （要带到案例列表页的productcode）
   */
  selectItem: function (item) {
    let _This = this;
    let sItem = item.target.dataset;
    // 不可选
    clearTimeout(timer);
    if (this.data.selable.indexOf(sItem.itemid) == -1) {
      this.setData({
        isShow: 'true',
      });
      var timer = setTimeout(function () {
        _This.setData({
          isShow: !_This.data.isShow
        });
      }, 2000);
      // clearTimeout(timer);
    } else {
      var arr = this.data.sSelect;
      var arrData = this.data.arrData;
      if (arr.indexOf(sItem.itemid) == -1) {
        arr.push(sItem.itemid);
        arrData.push(sItem);
        if (arr.length > 0) {
          this.setData({
            sSelect: arr,
            arrData: this.data.arrData,
            isactive: true
          });
        }
      } else {
        var index = arr.indexOf(sItem.itemid);
        if (index > -1) {
          arr.splice(index, 1);
          arrData.splice(index, 1);
        }
      }
      this.setData({
        sSelect: arr,
        arrData: this.data.arrData,
        isactive: _This.data.sSelect.length > 0 ? true : false
      });
    }
    this.setData({
      jSelect: sItem.itemid,
    });

  },
  /**
   * 选好了
   */
  selectItems: function (item) {
    let sItem = item.target.dataset;
    this.setData({
      isshow: this.data.isshow,
    });
    if (this.data.sSelect.length <= 0) {
      return false;
    }
    wx.navigateTo({
      url: 'caselist/caselist?pdata=' + (JSON.stringify(this.data.arrData) || {}) + '&itemids=' + this.data.sSelect
    });
  },
  selectTitle: function () {
    console.log("this is select title");
  },
  /**
   * 获取项目列表信息
   */
  getProjectList(param) {
    let _This = this;
    //全部的项目
    let pdata = { unionId: param };//,all:0
    wxRequest(wxaapi.product.list.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        // 没有案例的项目不可用
        var everyarr = [];
        result.data.data.forEach(function (item) {
          item.productList.forEach(function (oitem) {
            oitem.productList.forEach(function (titem) {
              everyarr.push(titem.productCode);
            })
          })
        })
        _This.setData({
          projectItems: result.data.data,// result.data.data,//, []
          allarr: everyarr//
        });
        if (_This.data.projectItems.length == 0) {
          _This.setData({
            Show: 'true',
          });
        }  
        
      } else { 
        console.log(result);
      }
      wx.hideLoading();
    });

    //可选的项目
    let abledata = { unionId: param, all: 0 };//,all:0
    wxRequest(wxaapi.product.list.url, abledata).then(function (result) {
      var codearr = [];
      if (result.data.code == 0) {
        result.data.data.forEach(function (item) {
          item.productList.forEach(function (oitem) {
            oitem.productList.forEach(function (titem) {
              codearr.push(titem.productCode);

            })
          })
        })
        _This.setData({
          // projectItems: result.data.data,
          selable: codearr
        });
      //提示判断
        if (_This.data.selable.length == 0) {
          _This.setData({
            Show: 'true',
          });
        }
      } else {
        console.log(result);
      }
      wx.hideLoading();
    });
  },
  fGetUserPhoneNumber(e) {
    console.log("get user phone num----->", e);
  }
})