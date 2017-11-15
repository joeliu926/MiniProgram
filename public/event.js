var eType={
  appShare:"appShare", //咨询师分享
  appOpen: "appOpen",//打开小程序
  caseLike: "caseLike",//喜欢不喜欢案例
  photoUpload: "photoUpload",//照片上传
  informationSubmit: "informationSubmit", //信息提交
  appQuit: "appQuit" //退出程序
};
var oEvent={
      code: "",
  eventAttrs: {
        appletId: "hldn",
    consultingId: 0,
    consultantId:"",
    triggeredTime:"",
    case: "",
    isLike: "",
    image:""

  },
  subjectAttrs: {
        appid:"yxy",
    consultantId: "",
    openid: "",
    unionid: "",
    mobile: ""
  }
    }
module.exports={
  eType: eType,
  oEvent: oEvent
};