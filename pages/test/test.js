var touchDotX = 0;//触摸时的原点
var touchDotY = 0;//触摸时的原点

Page({
  data: {
    aCaseList: [{ id: 0, item: "red" }, { id: 1, item: "green" }, { id: 2, item: "blue"}, { id: 3,item:"purple"}],
    aCurrentList:[],
    itemLeft:0,
    itemTop:0,
  },
  onLoad: function () {
    let _This = this;
    let aCaseList = _This.data.aCaseList;
    _This.setData({
      aCurrentList: aCaseList.slice(0,10)
    });

    wx.getSystemInfo({
      success: function (res) {
      //  console.log(res)

      }
    }) 


  },
  onShow: function () {
  },
  // 触摸开始事件
  fTouchStart: function (e) {
   // console.log("e.touches[0]------->", e, e.currentTarget.dataset.caseitem);
    let caseItem = e.currentTarget.dataset.caseitem;
    this.setData({
      currentItem: caseItem
    });
    touchDotX = e.touches[0].pageX; // 获取触摸时的原点touchDotX
    touchDotY = e.touches[0].pageY; // 获取触摸时的原点touchDotY
  },
  fTouchMove:function(e){
    //console.log("e.touches[0]------->", e.touches[0]);
    let _This=this;
    let tX = (e.touches[0].pageX - touchDotX);
    let tY = (e.touches[0].pageY - touchDotY);
    let currentItem = _This.data.currentItem;
    _This.fGenerateShow(currentItem,tX);
    if(Math.abs(tY)<Math.abs(tX)){
      _This.setData({
        itemLeft: (tX + "px"),
        itemTop: (tY + "px")
      }); 
    }
  },
  // 触摸结束事件
  fTouchEnd: function (e) {
    let _This=this;
    var touchMove = e.changedTouches[0].pageX;
    if (Math.abs(touchMove-touchDotX)>40){
      let clist = _This.data.aCurrentList;
      if (clist.length > 1) {
        let rmItem = clist.splice(0, 1);
        _This.setData({
          aCurrentList: clist
        });
      }
    }
    _This.setData({
      itemLeft: "0px",
      itemTop: "0px"
    });
  },
  /**
   * 生成显示的items，direction是切换的方向，大于0是向右，小于0是向左
   */
  fGenerateShow(item,direction){
    let _This=this;
    let aCaseList = _This.data.aCaseList;
    let aCount = aCaseList.length;
    let iIndex = _This.fFilterData(item);
   // let iIndex = _This.data.aCaseList.indexOf(item);
    //let iIndex = _This.data.aCurrentIndex;
    let aCurrentList = _This.data.aCurrentList;
    if (direction<0){
      aCurrentList = aCaseList.slice(iIndex,iIndex+2);
    }else{
      if (iIndex>0){
        aCurrentList[1]=aCaseList[iIndex - 1];
      }
    }
    _This.setData({
      aCurrentList: aCurrentList
    });
  },
  fFilterData(id){
    let _This = this;
    let aCaseList = _This.data.aCaseList;
    let oId=0;
  /*  aCaseList.forEach((item,index)=>{
      if (item.id == id) {
        console.log(item,"--------------------",id);
        oId = index;
      }
    });*/

    aCaseList.some((item, index) => {
      if (item.id == id) {
        oId = index;
      }
    });
     return oId;
  }
})