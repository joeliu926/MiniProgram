const wxaapi = require('../../../public/wxaapi.js');
const wxRequest = require('../../../utils/js/wxRequest.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    linkMansubmit:false,//判断提交
    currentClue:{},
    linkMan:{},
    sexitems: [
      { name: '男', value: 1 },
      { name: '女', value: 2, checked: true }
    ],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let _This=this;
    _This.setData({
      options: options
    });
    _This.fGetCustomerInfo();
  
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
  
  },
  /**
   * 获取客户信息
   */
  fGetCustomerInfo(){
    let options = this.data.options;
    let _This = this;
    let pdata = {
      id: options.customerId
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
      }
    });
  },
  /**
   * 改变姓名
   */
  flinkchangeName(e) {
    let _linkman = this.data.linkMan;
    _linkman.name = e.detail.value;
    this.setData({
      linkMan: _linkman
    });
    this.fValidateInfo();
  },
  /**
 * 验证姓名
 */
  fValidateName(e) {
    let nameValue = e.detail.value;
    if (nameValue.length> 6) {
      this.alertMessage("姓名长度不能超过六个汉字！", 'red');
    }
 
  },
  fValidateInfo(){
    let _linkman = this.data.linkMan;
    let linkMansubmit = this.data.linkMansubmit;
   
    //linkMansubmit= _linkman.name&&_linkman.name.length<=6&&(/^1\d{10}$/.test(_linkman.phoneNum))?true:false;
    linkMansubmit = _linkman.name && _linkman.name.length <= 6 && (_linkman.phoneNum==""||/^1\d{10}$/.test(_linkman.phoneNum)) ? true : false;
    this.setData({
      linkMansubmit: linkMansubmit
    });

  },
  /**
   * 改变性别
   */
  fradioChange: function (e) {
    let _linkman = this.data.linkMan;
    _linkman.gender = e.detail.value;
    this.setData({
      linkMan: _linkman
    });
    this.fValidateInfo();
  },
  /**
   * 修改出生年月
   */
  flinkchangeAge(e) {
    let _linkman = this.data.linkMan;
    _linkman.birthday = e.detail.value;
    this.setData({
      linkMan: _linkman
    });
    this.fValidateInfo();
  },
  /**
   * 修改电话
   */
  flinkchangePhone(e) {
    let _linkman = this.data.linkMan;
    _linkman.phoneNum = e.detail.value;
    this.setData({
      linkMan: _linkman
    });
    this.fValidateInfo();
  },
  /**
   * 验证手机号码
   */
  fValidatePhone(e){
    let phoneValue = e.detail.value;
    if (!/^1\d{10}$/.test(phoneValue)) {
       this.alertMessage("电话号码填写不正确！", 'red')
    }
  },
  /**
   * 修改微信
   */
  flinkchangeWechat(e) {
    let _linkman = this.data.linkMan;
    _linkman.wechatNum = e.detail.value;
    this.setData({
      linkMan: _linkman
    });
    this.fValidateInfo();
  },
  /**
   * 提交修改
   */
  fSubmitLinkman(params) {
 
    let options = this.data.options;
    //options.clueStatus==1是可编辑状态
    if (!this.data.linkMansubmit) {
      return;
    }
    if (options.clueStatus == 5) {
      this.alertMessage("已关闭客户不可以编辑！", 'yellow');
      return;
    }
    if (options.clueStatus != 1) {
      this.alertMessage("已预约客户不可以编辑！", 'yellow');
      return;
    }
    let _This = this;
    let linkmandata = this.data.linkMan;

    delete linkmandata.wechatMobile;
    let pdata = linkmandata;

    wxRequest(wxaapi.index.linkmanupdate.url, pdata).then(function (result) {
      console.log("update result-------",result);
      if (result.data.code == 0) {
        //_This.closewindow();
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 2000,
          success:function(){
            wx.navigateBack({
            });
          }
        });
 
      }
    });
  },
  /**
   * 提示信息
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