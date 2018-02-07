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
    dddddd: "../../../public/images/icon-tap.png",
    remarklist: [{}],
    interactlist: [],
    bookName: '',
    show: 'true',
    isshow: 'false',
    asShow: 'false',
    hide: 'flase',
    imgalist: [],
    // imgalist: ["http://pic32.photophoto.cn/20140807/0005018763115153_b.jpg", "http://pic28.photophoto.cn/20130827/0005018371946994_b.jpg", "http://pic28.photophoto.cn/20130830/0005018667531249_b.jpg","http://pic8.nipic.com/20100801/387600_002750589396_2.jpg"],//测试数据
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
      let resultobj = result.data.data;
      // console.log("========1111111111111111111=======resultobj", resultobj);
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
    // let giftid =8;
    console.log("e===========================>>>>>", e, giftid);
    if (giftid){
      wx.navigateTo({
        url: '../../client/cmassgift/cmassgift?giftid=' + giftid
      });
    }else{
      // console.log("该礼品id不存在");
      return false;
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
  }
})