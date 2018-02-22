const event = require('../../public/js/wxEvent.js'); //事件上报相关参数
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
    selectItem: [{ id: 0, text: '智能推荐', val: true }, { id: 2, text: '已预约', val: false }, { id: 1, text: '其它', val: false }],
    currentSelect: 0,//当前tab 已选择内容
    moreItem: ['编辑客户', '不再跟进'], //更多弹出选项
    menuType: true,//菜单类型 //true左 fase 右
    shareList: [],
    clueList: [],
    clueListOther: [],
    clueListOrder: [],
    oUInfo: {},
    showData: 0,
    clueNo: 1,
    clueCount: 0,
    clueNoOther: 1,
    clueCountOther: 0,
    clueNoOrder: 1,
    clueCountOrder: 0,
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
    startY: 0,
    showChoose:false
  },
  //移动开始
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX,
        startY: e.touches[0].clientY
      });
    }
  },
  //移动
  touchM: function (e) {
    var that = this
    if (e.touches.length == 1) {
      var moveX = e.touches[0].clientX;
      var disX = that.data.startX - moveX;
      var moveY = e.touches[0].clientY;
      var disY = that.data.startY - moveY;
      var moreWidth = that.data.moreWidth;
      let _disx = disX;

      disY = Math.abs(disY);
      disX = Math.abs(disX);

      //上下滑动不做处理
      if (disX < disY) {
        return;
      }
    
      if (_disx > 0) {
      } else {
        disX = 365 - disX;
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

      switch (this.data.currentSelect) {
        case 0:
          list = this.data.clueList;
          break;
        case 1:
          list = this.data.clueListOther;
          break;
        case 2:
          list = this.data.clueListOrder;
          break;
      } 
   
      if (list[index].txtStyle == 'left:0rpx;' || !list[index].txtStyle) {
        if (_disx < 0) {
          return;
        }
      }
      list[index].txtStyle = txtStyle;

      switch (this.data.currentSelect) {
        case 0:
          this.setData({
            clueList: list
          });
          break;
        case 1:
          this.setData({
            clueListOther: list
          });
          break;
        case 2:
          this.setData({
            clueListOrder: list
          });
          break;
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

      switch (this.data.currentSelect) {
        case 0:
          list = this.data.clueList;
          break;
        case 1:
          list = this.data.clueListOther;
          break;
        case 2:
          list = this.data.clueListOrder;
          break;
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
    switch (this.data.currentSelect){
      case 0:
        list = this.data.clueList;
      break;
      case 1:
        list = this.data.clueListOther;
      break;
      case 2:
        list = this.data.clueListOrder;
      break;
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
    switch (this.data.currentSelect) {
      case 0:
        this.setData({
          clueList: list,
          startX: 0
        });
        break;
      case 1:
        this.setData({
          clueListOther: list,
          startX: 0
        });
        break;
      case 2:
        this.setData({
          clueListOrder: list,
          startX: 0
        });
        break;
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
        oUInfo: result,
        oEvent: event.oEvent
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.menuType) {

      switch (this.data.currentSelect)
      {
        case 0:
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
        break;
        case 1:
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
        break;
        case 2:
          if (this.data.clueNoOrder * this.data.pageSize < this.data.clueCountOrder) {
            wx.showLoading({
              title: 'loading...',
            });
            setTimeout(function () {
              wx.hideLoading();
            }, 1000);

            this.setData({
              clueNoOrder: this.data.clueNoOrder + 1
            });
            let _this = this;
            setTimeout(function () {
              _this.getClueList();
            }, 200);
          }

        break;
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
    let _This = this;
    let oUInfo= _This.data.oUInfo;
     (!oUInfo.unionId)&&getApp().getUserData(function (result) {
       _This.fGetCUserInfo(result.unionId);
       _This.setData({
         oUInfo: result
       });
    });
    wx.stopPullDownRefresh();

    //let _This = this;
    setTimeout(function () {
      _This.pullRefresh();

    }, 1000);

  },
  pullRefresh() {
    if (this.data.menuType) {
      this.clearClueList();
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
  //打开分享详情
  openShare(params) {
    //console.log("-------------dataset----------", dataset);
    var dataset = params.currentTarget.dataset;
    if (dataset.obj.consultType==3) {
      wx.navigateTo({
        url: '../destmass/receivedetail/receivedetail?giftid=' + dataset.obj.gifts + '&consultationId=' + dataset.obj.id
      });
    }else{
      //this.alertMessage("此次分享没有详细！", 'yellow');
    }
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
   
    this.clearClueList();
    this.setData({
      searchName: '',
      showicon: false
    });

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
            });
            _This.fUserEvent(event.eType.leadClose);//关闭联系人
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

    wxRequest(wxaapi.index.linkmanupdate.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.closewindow();
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 2000
        });
        _This.fUserEvent(event.eType.contactEdit);//编辑联系人
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


    this.clearClueList();
  
    this.getClueList();
    this.closewindow();
  },
  clearClueList(){
    switch (this.data.currentSelect) {
      case 0:
        this.setData({
          clueList: [],
          clueNo: 1
        });
        break;
      case 1:
        this.setData({
          clueListOther: [],
          clueNoOther: 1
        });
        break;
      case 2:
        this.setData({
          clueListOrder: [],
          clueNoOrder: 1
        });
        break;
    }
  },
  //tab 选项卡
  selectType(params) {

    var dataset = params.currentTarget.dataset;
    this.data.selectItem.forEach(item => {
      if (item.id == dataset.id) {
        this.clearClueList();

        this.setData({
          currentSelect: dataset.id,
          searchName: '',
          showicon: false
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

  //
  navToCase(params){
    wx.navigateTo({
      url: '../projectcase/projectcase',
    });
  },
  navToGift(params) {
    wx.navigateTo({
      url: '../destmass/destmass',
    });
  },
  navToCancel(){
    this.setData({
      showChoose: false
    });
 
  },
  //菜单点击
  menuClick(params) {
    //console.log('params', params);
    switch (params.currentTarget.dataset.type) {
      case "1":
        this.setData({
          menuType: true
        });
        wx.setNavigationBarTitle({ title: '我的潜客' })
        break;
      case "2":
        this.setData({
          showChoose: true
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
    //console.log("currentClue------------", remark);
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

    let _pageNo=0;

    switch (this.data.currentSelect){
      case 0:
        _pageNo = this.data.clueNo;
      break;
      case 1:
        _pageNo = this.data.clueNoOther;
      break;
      case 2:
        _pageNo = this.data.clueNoOrder;
      break;
    }

    let pdata = {
      userUnionId: _This.data.oUInfo.unionId || "",
      group: this.data.currentSelect,
      searchName: this.data.searchName,
      pageNo: _pageNo,
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

          m.customerName = m.customerName > 5 ? m.customerName.substring(0, 5)+'..' : m.customerName;
          m.customerWxNickname = m.customerWxNickname > 5 ? m.customerWxNickname.substring(0, 5) + '..' : m.customerWxNickname;
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


        switch (_This.data.currentSelect) {
          case 0:
            _This.setData({ clueList: _This.data.clueList.concat(getArray) });
            _This.setData({ clueCount: result.data.data.count });
            break;
          case 1:
            _This.setData({ clueListOther: _This.data.clueListOther.concat(getArray) });
            _This.setData({ clueCountOther: result.data.data.count });
            break;
          case 2:
            _This.setData({ clueListOrder: _This.data.clueListOrder.concat(getArray) });
            _This.setData({ clueCountOrder: result.data.data.count });
            break;
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
      //console.log("sharelist result------------>", result);
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
        wx.setNavigationBarTitle({ title: '欢颜小助手' });
      }else{
        (_This.data.showData==1)&&_This.setData({showData:0});
      }
    });
  },
  /*
*事件参数 
*/
  fGetTempEvent() {
    var _This = this;
    let clueId = _This.data.currentClue.id;
    var oTempEvent = _This.data.oEvent;
    oTempEvent.shareEventId = _This.data.shareEventId || 1;
    oTempEvent.productCode = [""];
    oTempEvent.clueId = clueId; //线索id  
    oTempEvent.leadsId = clueId; //线索id新  leadsId
    oTempEvent.consultationId = _This.data.consultationId;//咨询会话ID
    oTempEvent.sceneId = _This.data.consultationId;// 场景sceneId  oUInfo.
    oTempEvent.eventAttrs = {
      consultantId: _This.data.oUInfo.unionId,
      clueId: clueId, //线索id  
      leadsId: clueId, //线索id新  leadsId
      consultationId: _This.data.consultationId,//咨询会话ID
      sceneId: _This.data.consultationId,// 场景sceneId  oUInfo.
      caseId: _This.data.sCurrentId || "",//
      appletId: "hldn",
      consultingId: _This.data.consultationId,
      isLike: _This.data.isLike,    ////0不喜欢 1喜欢2未选择
      reserveId: "",//
      agree: "",  //1是允许，0是拒绝
      imgNum: "",
      imgUrls: [],
      remark: '',
      triggeredTime: new Date().valueOf()
    }
    oTempEvent.subjectAttrs = {
      appid: "yxy",
      consultantId: _This.data.cstUid,
      openid: _This.data.oUInfo.openId,
      unionid: _This.data.oUInfo.unionId,
      mobile: _This.data.oUInfo.wechatMobile || ""
    };
    _This.setData({
      oEvent: oTempEvent
    });
  },
  /**
  * 用户事件
  */
  fUserEvent(eType) {
    let _This = this;
    _This.fGetTempEvent();
    var oData = _This.data.oEvent;
    oData.code = eType;
    wxRequest(wxaapi.event.v2.url, oData).then(function (result) {
      //console.log("edit event-----",result);
      if (result.data.code == 0) {
      } 
    });
  }



})