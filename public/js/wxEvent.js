const wxRequest = require('../../utils/js/wxRequest.js');
const wxaapi = require('../wxaapi.js');
var eType = {
  appShare: "appShare", //咨询师分享
  appOpen: "appOpen",//打开小程序
  caseLike: "caseLike",//喜欢不喜欢案例
  photoUpload: "photoUpload",//照片上传
  informationSubmit: "informationSubmit", //信息提交
  appQuit: "appQuit" //退出程序
};
var oEvent = {
  shareEventId: "", //当事件码是 appShare，获取该值，传值的时候带着相关的参数
  code: "", //事件码eType
  eventAttrs: {
    appletId: "hldn",
    consultingId: 0,
    consultantId: "",
    triggeredTime: "",
    case: "",
    isLike: "",
    image: ""

  },
  subjectAttrs: {
    appid: "yxy",
    consultantId: "",
    openid: "",
    unionid: "",
    mobile: ""
  }
}
var fEvent=function(){

}
module.exports = {
  eType: eType,
  oEvent: oEvent,
  fEvent: fEvent
};