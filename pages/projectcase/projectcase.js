const wxaapi = require('../../public/wxaapi.js');
const wxRequest = require('../../utils/js/wxRequest.js');
Page({
  data: {
    isactive: false,
    isshow: false,
    projectItems: [
      {
        "productName": " 眼部整形",
        "parentCode": "0",
        "productCode": "1001",
        "productList": [
          {
            "productName": "开眼角",
            "parentCode": "1001",
            "productCode": "2001",
            "productList": [
              {
                "productName": "开眼角",
                "parentCode": "1001",
                "productCode": "2001",
                "productList": [

                ]
              },
              {
                "productName": "双眼皮",
                "parentCode": "1001",
                "productCode": "2002",
                "productList": [

                ]
              },
              {
                "productName": "祛眼袋",
                "parentCode": "1001",
                "productCode": "2003",
                "productList": [

                ]
              },
              {
                "productName": "去黑眼圈",
                "parentCode": "1001",
                "productCode": "2004",
                "productList": [

                ]
              },
              {
                "productName": "丰卧蚕",
                "parentCode": "1001",
                "productCode": "2005",
                "productList": [

                ]
              },
              {
                "productName": "上睑整形",
                "parentCode": "1001",
                "productCode": "2006",
                "productList": [

                ]
              },
              {
                "productName": "下睑整形",
                "parentCode": "1001",
                "productCode": "2007",
                "productList": [

                ]
              },
              {
                "productName": "丰眉弓",
                "parentCode": "1001",
                "productCode": "2008",
                "productList": [

                ]
              },
              {
                "productName": "眼部综合",
                "parentCode": "1001",
                "productCode": "2009",
                "productList": [

                ]
              },
              {
                "productName": "眼部修复",
                "parentCode": "1001",
                "productCode": "2010",
                "productList": [

                ]
              }
            ]
          }
        ]
      }
    ],
      uicondata:"",
      oUserInfo:{},
      consultationId:"",
      jSelect:"",
      sSelect:[],
      arrData:[],
      selable: [],
      allarr:[],
      isShow:'false'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log("options pcase-->", options);
   
    let _This=this;
    wx.showLoading({
      title: 'loading...',
    });
    _This.setData({ 
      consultationId: options.consultationId,
      jSelect: options.productCode
      });
    //console.log("_This.data====>",_This.data);
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
   * 
   *选择项目 
   */ 
  selectItem:function(item){

    console.log("=====================================", item);
    let _This=this;
    let sItem = item.target.dataset;
    // 不可选
    if (this.data.selable.indexOf(sItem.itemid)==-1){
       
        this.setData({
          isShow:'true',
          
        });
        setTimeout(function(){
          _This.setData({
            isShow: 'false'
          });

        },2000);
    }
    this.setData({
      jSelect: sItem.itemid,
     
    });
    /*   wx.navigateTo({
        url: '/pages/client/sharecase/sharecase?iname=' + sItem.iname + '&itemid=' + sItem.itemid + '&paid=' + sItem.paid + '&paname=' + sItem.paname + '&consultationId=' + (this.data.consultationId||'')
      });*/

  
      var arr = this.data.sSelect;
      var arrData = this.data.arrData;
      // console.log(arr.indexOf(sItem.itemid));
      if (arr.indexOf(sItem.itemid) == -1) {
      // console.log("=========================ffffff");
        arr.push(sItem.itemid);
        arrData.push(sItem);    
        // console.log("888888888888888888",arrData);
      }else{
        var index = arr.indexOf(sItem.itemid);
        if (index > -1) {
          arr.splice(index, 1);   
          arrData.splice(index, 1);
          console.log(arrData);
        }
      }
      this.setData({
        sSelect: arr,
        arrData:this.data.arrData
      });
      // console.log(this.data.sSelect)
  },
  /**
   * 选好了
   */ 
  selectItems:function(item) {
   
    let sItem=item.target.dataset;
    // console.log("=====================================", item);
    this.setData({
      isactive: !this.data.isactive,
      isshow: this.data.isshow,
    })
    console.log(this.data.sSelect);
    if (this.data.sSelect.length<=0){
        return false;
    }
    // console.log(sItem.paid);
    wx.navigateTo({
      url: 'caselist/caselist?pdata=' + (JSON.stringify(this.data.arrData) || {}) + '&itemids='+this.data.sSelect
    });  
  },

  selectTitle:function(){
     console.log("this is select title");
  },
  /**
   * 获取项目列表信息
   */
  getProjectList(param){
    let _This=this;

    //全部的项目
    let pdata = { unionId: param };//,all:0
    console.log("pdata------->",pdata);
    wxRequest(wxaapi.product.list.url, pdata).then(function (result) {
     console.log("000000000000000000000000===>", result);
      if (result.data.code == 0) {
          // 没有案例的项目不可用
         var  everyarr=[];
        result.data.data.forEach(function(item){
              item.productList.forEach(function(oitem){
                oitem.productList.forEach(function(titem){
                    console.log(titem.productCode);
                    everyarr.push(titem.productCode);
                })
              })
          })
        _This.setData({ 
          projectItems: result.data.data,
          allarr:everyarr
        });
      } else {
        console.log(result);
      }
      wx.hideLoading();
      console.log("pdata------->", _This.data.projectItems);
    });

    //可选的项目
    let abledata = { unionId: param, all:0};//,all:0
    wxRequest(wxaapi.product.list.url, abledata).then(function (result) {
      console.log("3333333333333333333===>", result.data.data);
      var codearr=[];
      if (result.data.code == 0) {
        result.data.data.forEach(function (item) {
          item.productList.forEach(function (oitem) {
            oitem.productList.forEach(function (titem) {
              // console.log(titem.productCode);
              codearr.push(titem.productCode);
               
            })
          })
        })
        _This.setData({
            projectItems: result.data.data,
            selable:codearr
         });
      } else {
        console.log(result);
      }
      wx.hideLoading();
    });


    console.log('|||||||||||||||||', _This.data.allarr, '^^^^^^^^^^^^^^^', _This.data.selable)
  },



  fGetUserPhoneNumber(e){
    console.log("get user phone num----->", e);

  }


})