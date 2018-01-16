const wxaapi = require('../../public/wxaapi.js');
const wxRequest = require('../../utils/js/wxRequest.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    showicon: false,
    searchName: "",//搜索条输入框
    cluereMark: "",//线索备注
    clueClose: "",//关闭备注
    autoFocus: false,
    selectItem: [{ id: 0, text: '智能推荐', val: true }, { id: 1, text: '其它', val: false }],
    currentSelect: 0,//当前tab 已选择内容
    moreItem: ['编辑客户', '不再跟进'], //更多弹出选项
    menuType: true,//菜单类型 //true左 fase 右
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
    currentClue: {},
    clueStartDate: new Date(),
    sexitems: [
      { name: '男', value: 1 },
      { name: '女', value: 2, checked: true }
    ],
    linkMan: {
      "id": 0,
      "name": "",
      "phoneNum": "",
      "gender": 1,
      "wechatNum": "",
      "wechatMobile": "",
      "birthday": ""
    },
    errorMessage: '',
    errorType: false,
    errorColor: "#F76260",//#09BB07  #FFBE00   #F76260
    linkMansubmit: true,//联系人是否能提交
    moreWidth: 365,
    startX: 0,
  },
  //移动开始
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  //移动
  touchM: function (e) {
    var that = this
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = that.data.startX - moveX;
      var moreWidth = that.data.moreWidth;
      let _disx = disX;
      if (disX > 0) {
      } else {
        disX = 365 - Math.abs(disX);
      }

      //偏移太小不做处理
      if (disX < 20) {
        return;
      }

      var txtStyle = "";
      if (disX == 0 || disX < 0) {
        txtStyle = "left:0rpx";
      } else if (disX > 0) {
        txtStyle = "left:-" + disX + "rpx";
        if (disX >= moreWidth) {
          txtStyle = "left:-" + moreWidth + "rpx";
        }
      }
      var index = e.currentTarget.dataset.index;
      var list = [];

      if (this.data.currentSelect) {
        list = this.data.clueListOther;
      } else {
        list = this.data.clueList;
      }
      if (list[index].txtStyle == 'left:0rpx;' || !list[index].txtStyle) {
        if (_disx < 0) {
          return;
        }
      }
      list[index].txtStyle = txtStyle;
      if (this.data.currentSelect) {
        this.setData({
          clueListOther: list
        });
      } else {
        this.setData({
          clueList: list
        });
      }
    }
  },
  //移动结束
  touchE: function (e) {
    var that = this;


    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = that.data.startX - endX;
      var moreWidth = that.data.moreWidth;
      var index = e.currentTarget.dataset.index;
      var list = [];
      if (disX == 0) {
        return;
      }
      if (this.data.currentSelect) {
        list = this.data.clueListOther;
      } else {
        list = this.data.clueList;
      }
      if (list[index].txtStyle == 'left:0rpx;' || !list[index].txtStyle) {
        if (disX < 0) {
          return;
        }
      }
      if (disX > 50) {
        this.itemMove(index, 'left', endX);
      }
      else {
        this.itemMove(index, 'right', endX);
      }
    }
  },

  itemMove(index, diraction, init) {

    let list = [];
    if (this.data.currentSelect) {
      list = this.data.clueListOther;
    } else {
      list = this.data.clueList;
    }

    if (diraction == 'left') {
      list[index].txtStyle = "left:-365rpx;";
    }
    else {
      list[index].txtStyle = "left:0rpx;";
    }

    list.forEach((m, _index) => {
      if (_index != index) {
        m.txtStyle = "left:0rpx;";
      }
    });

    if (this.data.currentSelect) {
      this.setData({
        clueListOther: list,
        startX: 0
      });
    } else {
      this.setData({
        clueList: list,
        startX: 0
      });
    }
    return;
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.type && options.type == 'share') {
      this.menuClick({
        currentTarget: {
          dataset: { type: '3' }
        }
      });
    }
    if (options.init) {
      // getApp().globalData.flag=false;
    }
    var _This = this;
    getApp().getUserData(function (result) {
      _This.fGetCUserInfo(result.unionId);
      _This.setData({
        oUInfo: result
      });
      _This.getClueList();
      // _This.getClueList('initOther');
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
          let _this = this;
          setTimeout(function () {
            _this.getClueList();
          }, 200);
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

          let _this = this;
          setTimeout(function () {
            _this.getClueList();
          }, 200);

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

        let _this = this;
        setTimeout(function () {
          _this.getShareList();
        }, 200);
      }
    }
  },
  /**
    * 页面相关事件处理函数--监听用户下拉动作
    */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();

    let _this = this;
    setTimeout(function () {
      _this.pullRefresh();

    }, 1000);

  },
  pullRefresh() {
    if (this.data.menuType) {
      if (this.data.currentSelect) {
        this.setData({
          clueNoOther: 1,
          clueListOther: []
        });
      } else {
        this.setData({
          clueNo: 1,
          clueList: []
        });
      }
      this.getClueList();
    }
    else {
      this.setData({
        shareNo: 1,
        shareList: []
      });
      this.getShareList();
    }

  },
  //打开线索详情
  openItem(params) {
    var dataset = params.currentTarget.dataset;
    wx.navigateTo({
      url: './detail/cluedetail?id=' + dataset.obj.id
    });
  },
  alertMessage(content, types, times = 3000) {
    let color = "#F76260";
    if (types == 1 || types == 'green') {
      color = '#09BB07';
    }
    if (types == 2 || types == 'yellow') {
      color = '#FFBE00';
    }
    if (types == 3 || types == 'red') {
      color = ' #F76260';
    }
    this.setData({
      errorMessage: content,
      errorType: true,
      errorColor: color
    });
    let _this = this;
    setTimeout(function () {
      _this.setData({
        errorType: false
      });
    }, times);
  },
  //取消搜索
  closeSearch(params) {
    if (this.data.currentSelect) {
      this.setData({
        searchName: '',
        clueListOther: [],
        clueNoOther: 1,
        showicon: false
      });
    } else {
      this.setData({
        searchName: '',
        clueList: [],
        clueNo: 1,
        showicon: false
      });
    }
    this.getClueList();
    this.closewindow();
  },
  closewindow(params) {
    this.setData({
      showData: 0,
      autoFocus: false,
      errorType: false,
      cluereMark: "",
      clueClose: ""
    });
  },
  remarkinput(params) {
    this.setData({
      cluereMark: params.detail.value
    });
  },
  closeinput(params) {
    this.setData({
      clueClose: params.detail.value
    });
  },
  //预约
  bookOption(params) {
    let pobj = params.target.dataset.obj;
    wx.navigateTo({
      url: `../projectcase/book/book?userId=${pobj.userId}&userUnionId=${pobj.userUnionId}&appointmentId=${pobj.appointmentId}&tenantId=${pobj.tenantId}&customerId=${pobj.customerId}&clueId=${pobj.id}&clueStatus=${pobj.clueStatus}`,
    });
  },
  remarkOption(params) {
    let remark = params.currentTarget.dataset.obj;
    if (remark.clueStatus == 5) {
      this.alertMessage("关闭客户不可以备注！", 'yellow');
      return;
    }
    if (remark.clueStatus == 7) {
      this.alertMessage("已成交客户不可以备注！", 'yellow');
      return;
    }
    this.setData({
      showData: 3,
      currentClue: remark
    });
  },
  //提交备注
  submitRemark(params) {
    if (this.data.cluereMark.length < 1) {
      return;
    }
    let remark = this.data.currentClue;
    let _This = this;
    let pdata = {
      "clueId": remark.id,
      "clueStage": remark.clueStage,
      "creater": remark.creator,
      "customerId": remark.customerId,
      "id": remark.id,
      "remark": this.data.cluereMark,
      "userId": remark.userId
    };
    wxRequest(wxaapi.index.clueremark.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.closewindow();
        wx.showToast({
          title: '备注成功',
          icon: 'success',
          duration: 2000
        })
      }
    });

  },
  //关闭备注
  submitClose(params) {

    if (this.data.clueClose.length < 1) {
      return;
    }
    let remark = this.data.currentClue;
    let _This = this;
    let pdata = {
      "id": remark.id
    };
    wxRequest(wxaapi.index.clueclose.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        let fpdata = {
          "clueId": remark.id,
          "clueStage": remark.clueStage,
          "creater": remark.creator,
          "customerId": remark.customerId,
          "id": remark.id,
          "remark": _This.data.clueClose,
          "userId": remark.userId
        };
        wxRequest(wxaapi.index.clueremark.url, fpdata).then(function (result) {
          if (result.data.code == 0) {
            _This.removeArray(remark);

            _This.closewindow();
            wx.showToast({
              title: '成功关闭',
              icon: 'success',
              duration: 2000
            })
          }
        });
      }
    });
  },
  removeArray(params) {
    let inOther = false;
    this.data.clueListOther.forEach(om => {
      if (om.id == params.id) {
        inOther = true;
      }
    });
    if (inOther) {
      this.data.clueListOther.forEach(om => {
        if (om.id == params.id) {
          om.statusName = "关闭";
          om.clueStatus = 5;
        }
      });
      this.setData({
        clueListOther: this.data.clueListOther
      });
    } else {
      let repArray = [];
      this.data.clueList.forEach(m => {
        if (m.id != params.id) {
          repArray.push(m);
        }
      });
      params.statusName = "关闭";
      params.clueStatus = 5;
      this.data.clueListOther.push(params);
      this.setData({
        clueList: repArray,
        clueListOther: this.data.clueListOther
      });
    }
  },
  //提交联系人
  submitLinkman(params) {
    if (!this.data.linkMansubmit || this.data.currentClue.clueStatus != 1) {
      return
    }
    let remark = this.data.currentClue;
    if (remark.clueStatus != 1) {
      this.alertMessage("已预约客户不可以编辑！", 'yellow');
      return;
    }
    if (remark.clueStatus == 5) {
      this.alertMessage("已关闭客户不可以编辑！", 'yellow');
      return;
    }
    let _This = this;
    let linkmandata = this.data.linkMan;

    delete linkmandata.wechatMobile;
    let pdata = linkmandata;

    if (linkmandata.name.lenght < 1) {
      errorMessage
    }

    wxRequest(wxaapi.index.linkmanupdate.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.closewindow();
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 2000
        })
      }
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
        clueListOther: [],
        clueNoOther: 1
      });

    } else {
      this.setData({
        clueList: [],
        clueNo: 1
      });
    }
    this.getClueList();
    this.closewindow();
  },
  //tab 选项卡
  selectType(params) {


    var dataset = params.currentTarget.dataset;
    this.data.selectItem.forEach(item => {
      if (item.id == dataset.id) {
        if (dataset.id) {
          this.setData({
            searchName: '',
            clueListOther: [],
            clueNoOther: 1,
            showicon: false
          });
        } else {
          this.setData({
            searchName: '',
            clueList: [],
            clueNo: 1,
            showicon: false
          });
        }
        this.setData({
          currentSelect: dataset.id
        });
        item.val = true;
        this.getClueList();
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
  searchInput: function (e) {
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
  },
  radioChange: function (e) {
    let _linkman = this.data.linkMan;
    _linkman.gender = e.detail.value;
    this.setData({
      linkMan: _linkman
    });
  },
  linkchangeName(e) {
    let _linkman = this.data.linkMan;
    _linkman.name = e.detail.value;
    this.regixlinkman();
    this.setData({
      linkMan: _linkman
    });
  },
  linkchangeage(e) {
    let _linkman = this.data.linkMan;
    _linkman.birthday = e.detail.value;
    this.setData({
      linkMan: _linkman
    });
  },
  linkchangephone(e) {
    let _linkman = this.data.linkMan;
    _linkman.phoneNum = e.detail.value;
    this.regixlinkman();
    this.setData({
      linkMan: _linkman
    });
  },
  linkchangewechat(e) {
    let _linkman = this.data.linkMan;
    _linkman.wechatNum = e.detail.value;
    this.setData({
      linkMan: _linkman
    });
  },
  //菜单点击
  menuClick(params) {
    console.log('params', params);
    switch (params.currentTarget.dataset.type) {
      case "1":
        this.setData({
          menuType: true
        });
        wx.setNavigationBarTitle({ title: '我的潜客' })
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
        wx.setNavigationBarTitle({ title: '我的分享' })
        break;
    }
  },
  //线索更多点击
  bindPickerChange(params) {
    let remark = params.currentTarget.dataset.obj;
    this.setData({
      currentClue: remark
    });
    switch (params.detail.value) {
      case "0":
        this.setData({
          showData: 4
        });
        let remark = this.data.currentClue;
        let _This = this;
        let pdata = {
          "id": remark.customerId
        };
        wxRequest(wxaapi.index.linkman.url, pdata).then(function (result) {
          if (result.data.code == 0) {
            let getobj = result.data.data;
            let linkman = {
              "id": getobj.id,
              "name": getobj.name,//name
              "phoneNum": getobj.phoneNum,//phoneNum
              "gender": getobj.gender,//gender
              "wechatNum": getobj.wechatNum,//wechatNum
              "wechatMobile": getobj.wechatMobile,//wechatMobile
              "birthday": getobj.birthday
            }

            let sexitems = [
              { name: '男', value: 1 },
              { name: '女', value: 2, checked: true }
            ];

            if (getobj.gender == 1) {
              sexitems = [
                { name: '男', value: 1, checked: true },
                { name: '女', value: 2, checked: false }
              ];
            }
            linkman.phoneNum = linkman.wechatMobile ? linkman.wechatMobile : linkman.phoneNum;

            _This.setData({
              linkMan: linkman,
              sexitems: sexitems
            });
            _This.regixlinkman('init');
          }
        });
        break;
      case "1":
        let reobj = params.currentTarget.dataset.obj;
        if (reobj.clueStatus == 5) {
          this.alertMessage("已关闭！", 'yellow');
          return;
        }

        if (reobj.clueStatus != 1) {
          this.alertMessage("已预约客户不可以关闭！", 'yellow');
          return;
        }
        this.setData({
          showData: 5
        });
        break;
      case "2":

        break;
    }
  },
  //验证联系人
  regixlinkman(params) {



    let cansubmit = true;
    let linkman = this.data.linkMan;
    if (linkman.name.length < 1 || linkman.phoneNum.length < 1) {
      cansubmit = false;
    }
    let message = false;
    if (/^1\d{10}$/.test(linkman.phoneNum)) {
    } else {
      cansubmit = false;
      message = true;
    }
    this.setData({
      linkMansubmit: cansubmit
    });

    if (params != 'init') {
      if (linkman.name.length > 6) {
        this.alertMessage("姓名长度不能超过六个汉字！", 'red')
        cansubmit = false;
      }
      if (message) {
        this.alertMessage("电话号码填写不正确！", 'red')
      }
    }

  },
  fClearData: function () {
    this.setData({
      showicon: false,
      searchName: ""
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
      pageNo: this.data.currentSelect ? this.data.clueNoOther : this.data.clueNo,
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
          let cname = m.customerName;
          if (!cname) {
            cname = m.customerWxNickname;
          } else {
            if (m.customerWxNickname) {
              cname += '(' + m.customerWxNickname + ')';
            }
          }
          m.customerName = cname;
          m.productList = slist;
        });
        if (_This.data.currentSelect) {
          _This.setData({ clueListOther: _This.data.clueListOther.concat(getArray) });
          _This.setData({ clueCountOther: result.data.data.count });
        } else {
          _This.setData({ clueList: _This.data.clueList.concat(getArray) });
          _This.setData({ clueCount: result.data.data.count });
        }
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
          showData: 1
        });
        wx.setNavigationBarTitle({ title: '欢颜小助手' })
      }
    });
  }
})