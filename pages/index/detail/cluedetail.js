const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectItem: [{ id: 1, text: '互动', val: true, }, { id: 2, text: '备注', val: false, }],
    clueDetail: {},
    clueName: '',
    clueStage: '',
    remarklist: [{}],
    interactlist: [],
    bookName: '',
    show: 'true',
    isshow: 'false',
    asShow: 'false',
    hide: 'flase',
    imgalist: [],
    showData:0,//显示状态0 是显示线索，5是关闭线索
    cluereMark:"",//提交备注
    clueClose: "",//关闭备注
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initData(options.id);
  },
  /**
   *去 预约页面
   */ 
  bookOption() {
    // let pobj = params.target.dataset.obj;
    wx.navigateTo({
      url: `../../projectcase/book/book?userId=${this.data.clueDetail.userId}&userUnionId=${this.data.clueDetail.userUnionId}&appointmentId=${this.data.clueDetail.appointmentId}&tenantId=${this.data.clueDetail.tenantId}&customerId=${this.data.clueDetail.customerId}&clueId=${this.data.clueDetail.id}&clueStatus=${this.data.clueDetail.clueStatus}`,
    });
  },
  /**
   * 拨打电话
   */
  fMakePhone() {
    let _This = this;
    wx.makePhoneCall({
      phoneNumber: this.data.clueDetail.customerWechatMobile ? this.data.clueDetail.customerWechatMobile : this.data.customerPhoneNum
    })
  },


  /**
   *  初始化 备注
   */
  initRemark() {
    let _This = this;
    let pdata = {
      clueId: this.data.clueDetail.id
    };
    wxRequest(wxaapi.index.remarklist.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _This.setData({
          remarklist: result.data.data.list,
        });
      } else {
        console.log("load project info error==>", result);
      }
    });
  },
  /**
   *  获取预约页面中  互动轨迹的数据 
   */
  initInteract() {
    let _This = this;
    let pdata = {
      clueId: this.data.clueDetail.id,  //this.data.clueDetail.id,
    };
    wxRequest(wxaapi.consult.interactlist.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        if (result.data.data.length == 0) {
          _This.setData({
            asShow: "true"
          });
          return;
        }
        var interactlists = result.data.data[0].events;
        result.data.data.forEach(function (item) {
          interactlists = item.events;
          return;
        })
        if (interactlists.length == 0) {
          _This.setData({
            asShow: "true"
          });
        } else {
          _This.setData({
            asShow: "false"
          });
        }
        //  不要删除  暂时注释
        //  var imgUrlArr=[];  
        // interactlists.forEach(function(item){
        //   if (item.imgUrls && item.code =="photoUpload"){
        //     imgUrlArr = imgUrlArr.concat(item.imgUrls); 
        //   }
        // }) 
        // // 过滤去重图片数组
        // imgUrlArr = imgUrlArr.filter(function (item, index, oProduct) {
        //   return oProduct.indexOf(item) == index;
        // })
        //  不要删除  暂时注释
        _This.setData({
          // imgalist: imgUrlArr,//暂时注释
          interactlist: interactlists,
        });
      } else {
        console.log("load project info error==>", result);
      }
    });
  },


  /**
   * 点击图片图标 查看详细的图片 
   */
  previewImage: function (e) {
    var current = e.currentTarget.dataset.src;
    wx.previewImage({
      current: current, // 当前显示图片的http链接 
      urls: e.currentTarget.dataset.urls
      //urls: this.data.imgalist // 需要预览的图片http链接列表  
    })
  },
  /**
   *通过点击事件 判断他们的事件类型从而执行不同的动作
   */

  initData(params) {
    let _This = this;
    let pdata = {
      id: params
    };
    wxRequest(wxaapi.index.cluedetail.url, pdata).then(function (result) {

      //console.log("result-----------", result);

      let resultobj = result.data.data;
      if (result.data.code == 0) {
        let cname = resultobj.customerName;
        if (!cname) {
          cname = resultobj.customerWxNickname;
        } else {
          if (resultobj.customerWxNickname) {
            cname += '(' + resultobj.customerWxNickname + ')';
          }
        }
        let slist = [];
        resultobj.productList.forEach((sm, index) => {
          if (sm.productName) {
            slist.push(sm);
          }
        });
        resultobj.productList = slist;
        let _bookname = "去预约";

        if (resultobj.appointmentId) {
          _bookname = resultobj.appointmentTime;
        }

        _This.setData({
          clueDetail: resultobj,
          clueName: cname,
          bookName: _bookname
        });
        _This.initInteract();
        _This.initRemark();
      } else {
        console.log("load project info error==>", result);
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

  }
  ,
  // tab选项卡切换 互动和备注
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
    if (dataset.id == 1) {
      this.initInteract();
      this.setData({
        show: 'true',
        isshow: 'false',
      })
    } else if (dataset.id == 2) {
      this.setData({
        show: 'false',
        isshow: 'true',
        asShow: 'false'
      })
    }

    this.setData({
      selectItem: this.data.selectItem
    });
  },
  // 分享了案例
  sharecase() {

  },
  // 浏览了案例
  caseview() {

  },

  // 点击跳转到所喜欢的案例（单个） 
  likecase(e) {
    let caseid = e.currentTarget.dataset.caseid;
    if (caseid) {
      wx.navigateTo({
        url: '/pages/index/casedetail/casedetail?caseid=' + caseid
      });
    } else {
      // console.log("该案例id不存在");
      return false;
    }
  },
  /**
   *  领取了礼品  跳转到礼品页面 
   */
  getgift(e) {
    let giftid = e.currentTarget.dataset.giftid;
    if (giftid){
      wx.navigateTo({
        url: '/pages/client/cmassgift/cmassgift?giftid=' + giftid
      });
    }
  },
  // 跳转到浏览的礼品页面去
  opengift(){

  },
  // 通过点击电话号码  向客户拨打电话；
  callhim(e) {
    var photonum = e.target.dataset.num;
    wx.makePhoneCall({
      phoneNumber: photonum
    })
  },
  /**
   * 点击跳转到备注的列表页面
   */
  remarklist() {
    this.data.selectItem.forEach(item => {
      if (item.id == 1) {
        item.val = false;
      } else {
        item.val = true;
      }
    });
    this.setData({
      selectItem: this.data.selectItem,
      show: 'false',
      isshow: 'true',

    });
  },
  /**
   * 备注用户
   */
  fRemark(){
    this.setData({
      showData: 3
    });
  },
  /**
   * 点击再跟进
   */
  fFollowUp(){
  //待跟进
    let clueDetail = this.data.clueDetail;
    let pdata = {
      clueId: clueDetail.id,
    };
    wxRequest(wxaapi.index.waitflow.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        wx.showToast({
          title: '设置成功！',
          icon: 'success',
          duration: 2000
        });
      }
    });
  },
  /**
   * 去预约
   */
  fGoToBook(){
    this.bookOption();
  },
  /**
   * 关闭线索
   */
  fCloseClue(){
    let clueDetail = this.data.clueDetail;
    if (clueDetail.clueStatus == 5) {
      this.alertMessage("客户已是关闭状态！", 'yellow');
      return;
    }

    if (clueDetail.clueStatus != 1) {
      this.alertMessage("已预约客户不可以关闭！", 'yellow');
      return;
    }
    this.setData({
      showData:5
    });
  },
/**
 * 关闭文本框备注
 */
  closeinput(params) {
    this.setData({
      clueClose: params.detail.value
    });
  },
  //关闭备注
  submitClose(params) {

    if (this.data.clueClose.length < 1) {
      return;
    }
    let clueDetail = this.data.clueDetail;
    let _This = this;
    let pdata = {
      "id": clueDetail.id
    };
    wxRequest(wxaapi.index.clueclose.url, pdata).then(function (result) {
      //console.log("wxaapi.index.clueclose.url-----", result);
      if (result.data.code == 0) {
        let fpdata = {
          "clueId": clueDetail.id,
          "clueStage": clueDetail.clueStage,
          "creater": clueDetail.creator,
          "customerId": clueDetail.customerId,
          "id": clueDetail.id,
          "remark": _This.data.clueClose,
          "userId": clueDetail.userId
        };
        return wxRequest(wxaapi.index.clueremark.url, fpdata);
      }else{
        return {data:{}};
      }
    }).then(function (result){
      //console.log("wxaapi.index.clueremark.url-----", result);
      if (result.data.code == 0) {
        _This.closewindow();
        wx.showToast({
          title: '成功关闭',
          icon: 'success',
          duration: 2000
        });
        _This.initData(clueDetail.id);
        //_This.fUserEvent(event.eType.leadClose);//关闭联系人
      }
    });
  },
  /**
   * 关闭弹出框
   */
  closewindow(params) {
    this.setData({
      showData: 0,
      autoFocus: false,
      errorType: false,
      cluereMark: "",
      clueClose: ""
    });
  },
  /**
   * 备注文本框
   */
  remarkinput(params) {
    this.setData({
      cluereMark: params.detail.value
    });
  },
  //提交备注
  submitRemark(params) {
    let clueDetail = this.data.clueDetail;
    //console.log("------clueDetail--------", clueDetail);
    if (this.data.cluereMark.length < 1) {
      return;
    }
    let _This = this;
    let pdata = {
      "clueId": clueDetail.id,
      "clueStage": clueDetail.clueStage,
      "creater": clueDetail.creator,
      "customerId": clueDetail.customerId,
      "id": clueDetail.id,
      "remark": this.data.cluereMark,
      "userId": clueDetail.userId
    };
    wxRequest(wxaapi.index.clueremark.url, pdata).then(function (result) {
      //console.log("添加备注------",result);
      if (result.data.code == 0) {
        _This.closewindow();

        wx.showToast({
          title: '备注成功',
          icon: 'success',
          duration: 2000
        });
       // _This.initInteract(); 
      }
    });
  },
  /**
   * 编辑客户
   */
  fEditCustomer(){
   //console.log("edit customer-----");
   let clueDetail = this.data.clueDetail;
   wx.navigateTo({
     url: `/pages/index/editcustomer/editcustomer?customerId=${clueDetail.customerId}&clueStatus=${clueDetail.clueStatus}`,
   })
  },
  /**
   * 弹出消息
   */
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
})