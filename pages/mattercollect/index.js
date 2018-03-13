// pages/mattercollect/index.js
const wxaapi = require('../../public/wxaapi.js');
const wxRequest = require('../../utils/js/wxRequest.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
      showType:0,
      currentCustomer: {
        "id": 0,
        "logo": "",
        "name": "",
        "phoneNum": "",
        "gender": 1,
        "wechatMobile": "",
        "wxNickname": ""
      },
      currentTag: [],
      picList:[],
      tagList: [],
      customerList:[],
      tagText:'',
      oUInfo:'',
      errorMessage: '',
      errorType: false,
      errorColor: "#F76260",//#09BB07  #FFBE00   #F76260
      linkMan: {
        "id": 0,
        "name": "",
        "phoneNum": "",
        "gender": 1,
        "wechatNum": "",
        "wechatMobile": "",
        "birthday": ""
      },
      sexitems: [
        { name: '男', value: 1 },
        { name: '女', value: 2, checked: true }
      ],
      linkMansubmit: true,//联系人是否能提交
      searchName:'',
      autoFocus:false,
      showicon:false,
      showUpload:false,
      history: [],
      history_detail: {},
      his_searchName:'',
      his_autoFocus: false,
      his_showicon: false,
      pageNo: 1,
      pageSize: 20,
      pageCount:0,
      showAddNewCustomer:false,
      playsrc:'',
      playShow:false
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _this =this;
    getApp().getUserData(function (result) {
      _this.setData({
        oUInfo: result,
      });
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
    this.initcustomer('');
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
    wx.stopPullDownRefresh();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pageNo * this.data.pageSize < this.data.pageCount) {
    
      this.setData({
        pageNo: this.data.pageNo + 1
      });
      let _this = this;
      setTimeout(function () {
        _this.getHistory(_this.data.his_searchName);
      }, 200);
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  //显示弹层
  chooseShow: function (params){
    var stype = params.currentTarget.dataset.obj;
    this.setData({
      showType: stype
    });

    if (stype==4){
      this.getHistory(this.data.his_searchName);
    }

    if (stype == 1) {
      this.initcustomer('');
    }
  },
  //关闭按钮
  closewindow:function(params){
    this.setData({
      showType: 0,
      history:[],
      showAddNewCustomer:false,
      searchName:''
    });
  },
  //输入标签
  inputTagText:function(params){
    this.setData({
      tagText: params.detail.value
    });
    if (params.detail.value.length<1){
      this.setData({
        tagList:[]
      });
      return;
    }
   
    let _this = this;
    let pdata = {
      "userUnionId": this.data.oUInfo.unionId,
      "name": this.data.tagText,
      "pageNo":0,
      "pageSize":10
    };
    wxRequest(wxaapi.collect.taglist.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _this.setData({
          tagList: result.data.data.list
        });
      }
    });

  },
  //添加标签
  addTag:function(params){
    if (this.data.tagText.length<1)
      return;
    if (this.data.tagText.length > 10)
    {
      this.alertMessage("标签不能超过十个字符", 'yellow');
      return;
    }
     
    let _this = this;
    let pdata = {
      "userUnionId": this.data.oUInfo.unionId,
      "name": this.data.tagText
    };
    wxRequest(wxaapi.collect.createtag.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        let taglist = _this.data.currentTag;
        taglist.push(result.data.data);
        _this.setData({
          currentTag: taglist,
          tagText:''
        });
      }
      else if (result.data.code==13001){
        _this.alertMessage("标签已经存在", 'yellow');
      }
    });
  },
  //选择标签
  selectTag:function(params){
    var tag = params.currentTarget.dataset.obj;
    var taglist = this.data.currentTag;
    let hasTag = false;

    this.data.currentTag.forEach(m => {
      if (m.name == tag.name) {
        hasTag=true;
        return;
      }
    });

    if (!hasTag) 
    {
      taglist.push(tag);
      this.setData({
        currentTag: taglist
      });
    }
  },
  deleteTag: function (params) {
    var tag = params.currentTarget.dataset.obj;
    var newList  = [];
    this.data.currentTag.forEach(m=>{
      if (m.name != tag.name){
        newList.push(m);
      }
    });
    this.setData({
      currentTag: newList
    });
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
    //this.regixlinkman();
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
    //this.regixlinkman();
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
  //提交联系人
  submitLinkman(params) {

    this.regixlinkman();
    if (!this.data.linkMansubmit) {
      return
    }
   
    let _this = this;
    let linkmandata = this.data.linkMan;

    delete linkmandata.wechatMobile;
    let pdata = linkmandata;

    pdata.userUnionid = this.data.oUInfo.unionId;
    wxRequest(wxaapi.collect.createcustomer.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000
        });
      //  let custlist = _this.data.customerList;
      //  custlist.push(result.data.data);
        _this.setData({
          showType:0,
          //customerList: custlist,
          currentCustomer: result.data.data
        });
      }
      if (result.data.code == 12001){
        _this.alertMessage("手机号已存在", 'yellow');
      }
    });
  },
  //验证联系人
  regixlinkman(params) {
    let cansubmit = true;
    let linkman = this.data.linkMan;
    if (linkman.name.length < 1 || linkman.phoneNum.length < 1) {
      this.alertMessage("电话与姓名为必填项！", 'red')
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
  searchCustomerinput(params){
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
    this.setData({
      showAddNewCustomer: true
    });
    this.initcustomer(params.detail.value);
  },
  initcustomer:function(params){
    let _this = this;
    let pdata = {
      "userUnionid": this.data.oUInfo.unionId,
      "fieldValue": params,
      "pageNo": 0,
      "pageSize": 10
    };
    wxRequest(wxaapi.collect.customerlist.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        _this.setData({
          customerList: result.data.data.list
        });
      }
    });
  },
  searchInput: function (e) {
    if (e.detail.value.length > 0) {
      this.setData({
        showicon: true
      });
    } else {
      this.setData({
        showicon: false
      });
    }
  },
  fClearData: function () {
    this.setData({
      showicon: false,
      searchName: "",
      his_showicon: false,
      his_searchName: ""
    });
  },
  chooseItem:function(params){
    var tag = params.currentTarget.dataset.obj;
    this.setData({
      currentCustomer: tag,
      showType:0
    });
  },
  addMedia:function(params){
    this.setData({
      showUpload: true
    });
  },
  //上传媒体
  selceItem:function(params){
    var tag = params.currentTarget.dataset.obj;
    let _this =this;
   
    wx.showLoading({
      title: 'uploading...',
    });

    switch (tag){
      case '1':
        wx.chooseImage({
          success: function (res) {
            var tempFilePaths = res.tempFilePaths

            tempFilePaths.forEach(m=>{
              wx.uploadFile({
                url: wxaapi.img.uploadv3.url,
                filePath: m,
                name: 'file',
                formData: {},
                success: function (res) {
                  wx.hideLoading();
                  let oldlist = _this.data.picList;
                  let resultlist = JSON.parse(res.data).data;

                  console.log('resultlist', resultlist);
                  resultlist.forEach(m => {
                    oldlist.push({ name: m.name, url: m.url, pic: m.url, type: 1 });
                  });
                  _this.setData({ picList: oldlist });
                }
              })
            })
           
          }
        })
      break;
      case '2':
        wx.chooseVideo({
          success: function (res) {
            var tempFilePaths = res.tempFilePath
            wx.uploadFile({
              url: wxaapi.img.uploadv3.url, 
              filePath: tempFilePaths,
              name: 'file',
              formData: {
                'user': 'test'
              },
              success: function (res) {
                wx.hideLoading();
                let oldlist = _this.data.picList;
                let resultlist = JSON.parse(res.data).data;
                resultlist.forEach(m => {
                  // let pdata = {
                  //   "videoname": m.name
                  // };
                  // wxRequest(wxaapi.collect.getthubm.url, pdata).then(function (result) {
                  //   if (result.data.code == 0) {
                  //     oldlist.push({ name: m.name, url: m.url, pic: result.data.data,type: 2 });
                  //     _this.setData({ picList: oldlist });
                  //   }
                  // });
                  oldlist.push({ name: m.name, url: m.url, pic: '../../public/images/play-btn.png', type: 2 });
                 
                });

                _this.setData({ picList: oldlist });
              }
            })
          }
        })
      break;
      case '3':
        wx.hideLoading();
      break;
    }
    this.setData({
      showUpload: false
    });
    wx.hideLoading();
  },
  delMedia:function(params){
    var tag = params.currentTarget.dataset.obj;
    let newlist = [];
    this.data.picList.forEach(m=>{
      if (tag.name!=m.name){
        newlist.push(m);
      }
    })
    this.setData({
      picList: newlist
    });
  },
  //提交上传
  submit_cancel:function(params){
    //wx.navigateBack({ changed: true });  

    wx.navigateTo({
      url: '../index/home'
    });
  },
  submit_OK:function(params){
    let _this = this;
    let postdata = {
      "customerId": 0,
      "fileVo": [],
      "unionId": "",
      "tagIds": [],
      "uploadNum": 0
    };

    if (this.data.picList.length<1){
      _this.alertMessage("上传失败，请选择图片或视频", 'red');
      return;
    }

    if ( this.data.currentCustomer.name.length < 1) {
      _this.alertMessage("上传失败，请选择客户", 'red');
      return;
    }

    //数据填充
    postdata.customerId = this.data.currentCustomer.id;
    postdata.unionId = this.data.oUInfo.unionId;
    this.data.picList.forEach(m=>{
      postdata.fileVo.push({name:m.name,"type":m.type});
    });
    this.data.currentTag.forEach(m=>{
      postdata.tagIds.push(m.id);
    });
    postdata.uploadNum = postdata.fileVo.length;
    let pdata = {
      "postobj": JSON.stringify(postdata)
    };
    wxRequest(wxaapi.collect.create.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        wx.showToast({
          title: '上传成功，待管理员审核！',
          icon: 'success',
          duration: 2000
        });
        _this.setData({ 
          history_detail: _this.data.history_detail ,
          showType: 4,
          currentTag:[],
          currentCustomer: {
            "id": 0,
            "logo": "",
            "name": "",
            "phoneNum": "",
            "gender": 1,
            "wechatMobile": "",
            "wxNickname": ""
          },
          picList:[]
        });
        _this.getHistory(_this.data.his_searchName);
      }else{
        _this.alertMessage("上传失败", 'red')
      }
    });
  },
  //历史搜索
  his_searchCustomerinput(params) {
    if (params.detail.value.length > 0) {
      this.setData({
        his_showicon: true,
        his_searchName: params.detail.value,
        history:[]
      });
    } else {
      this.setData({
        his_showicon: false,
        his_searchName: "",
        history:[]
      });
    }

    this.getHistory(params.detail.value);
     
  },
  getHistory:function(search){
    let _this = this;
    let pdata = {
      "unionId": this.data.oUInfo.unionId,
      "customerName": search,
      "pageNo": this.data.pageNo,
      "pageSize": this.data.pageSize
    };
    wx.showLoading({
      title: 'loading...',
    });

    wxRequest(wxaapi.collect.list.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        wx.hideLoading();
        var newlist = _this.data.history.concat(result.data.data.list);
        _this.setData({
          history: newlist,
          pageCount: result.data.data.count
        });
      }
    });
  },
  his_searchInput: function (e) {
    if (e.detail.value.length > 0) {
      this.setData({
        his_showicon: true
      });
    } else {
      this.setData({
        his_showicon: false
      });
    }
  },
  his_select: function (params){
    var tag = params.currentTarget.dataset.obj;
    let _this = this;
    let pdata = { "id": tag.id};
    
    wxRequest(wxaapi.collect.detail.url, pdata).then(function (result) {
      if (result.data.code == 0) {
         _this.setData({
           showType: 5,
           history_detail: result.data.data
         });
      }
    });
  },

  //重新上传
  his_submit_cancel: function (params) {
    this.setData({
      showType:4
    });
  },
  his_submit_OK: function (params) {
    let _this = this;
    let postdata = {
      "customerId": 0,
      "fileVo": [],
      "unionId": "",
      "tagIds": [],
      "uploadNum": 0,
      "id": this.data.history_detail.id
    };

    //数据填充
    postdata.customerId = this.data.currentCustomer.id;
    postdata.unionId = this.data.oUInfo.unionId;
    
    this.data.history_detail.fileVo.forEach(m => {
      if (m.rstatus==2){
        postdata.fileVo.push({ name: m.name, type: m.type });
      }
    });
    postdata.uploadNum = postdata.fileVo.length;

    if(postdata.uploadNum<1){
      _this.alertMessage("内容无变更，无须重新上传", 'yellow')
      return;
    }

    let pdata = {
      "postobj": JSON.stringify(postdata)
    };
    wxRequest(wxaapi.collect.recreate.url, pdata).then(function (result) {
      if (result.data.code == 0) {
        wx.showToast({
          title: '上传成功！',
          icon: 'success',
          duration: 2000
        });

        _this.setData({
          history_detail: _this.data.history_detail,
          showType: 4
        });
      }else{
        _this.alertMessage("上传失败", 'red')
      }
    });
  },
  his_reupload:function(params){
    var tag = params.currentTarget.dataset.obj;
    let _this = this;

    wx.showLoading({
      title: 'uploading...',
    });
    switch (tag.type) {
      case 1:
        wx.chooseImage({
          success: function (res) {
            var tempFilePaths = res.tempFilePaths
            wx.uploadFile({
              url: wxaapi.img.uploadv3.url,
              filePath: tempFilePaths[0],
              name: 'file',
              formData: {
                'user': 'test'
              },
              success: function (res) {
                wx.hideLoading();
                _this.data.history_detail.fileVo.forEach(m => {
                   if(m.id==tag.id){
                     m.name=JSON.parse(res.data).data[0].name;
                     m.url = JSON.parse(res.data).data[0].url;
                     m.rstatus =2;
                   }
                });
                _this.setData({ history_detail: _this.data.history_detail });
              }
            })
          }
        })
        break;
      case 2:
        wx.chooseVideo({
          success: function (res) {
            var tempFilePaths = res.tempFilePath
            wx.uploadFile({
              url: wxaapi.img.uploadv3.url,
              filePath: tempFilePaths,
              name: 'file',
              formData: {
                'user': 'test'
              },
              success: function (res) {
                wx.hideLoading();
                let oldlist = _this.data.picList;
                let resultlist = JSON.parse(res.data).data;
                resultlist.forEach(m => {
                  let pdata = {
                    "videoname": m.name
                  };
                  wxRequest(wxaapi.collect.getthubm.url, pdata).then(function (result) {
                    if (result.data.code == 0) {
                      oldlist.push({ name: m.name, url: m.url, pic: result.data.data, typ: 2 });
                      _this.setData({ picList: oldlist });
                    }
                  });
                });
              }
            })
          }
        })
        break;
      case '3':
        wx.hideLoading();
        break;
    }
    wx.hideLoading();
  },
  preImage:function(params){
    var tag = params.currentTarget.dataset.obj;
    var picl = [];
    this.data.picList.forEach(m=>{
      if(m.type==1){
        picl.push(m.url);
      }
    })

    wx.previewImage({
      current: tag.url, // 当前显示图片的http链接
      urls: picl // 需要预览的图片http链接列表
    })
  },
  preVideo:function(params){
    var tag = params.currentTarget.dataset.obj;
    this.setData({
      playShow: true,
      playsrc: tag.url
    });
    let videoContext = wx.createVideoContext('topVideo');
    videoContext.play();
  },
  closeVideo:function(params){
    let videoContext = wx.createVideoContext('topVideo');
    videoContext.pause();
    this.setData({
      playShow: false
    });
  }
})