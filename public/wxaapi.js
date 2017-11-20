var gConfig={
  remote:"https://27478500.qcloud.la/wxa",
  remoteWx: "https://27478500.qcloud.la/wx",
  //remote: "https://27478500.qcloud.la/wxa/test",
 // apiType:"test/" //"test/" or "",
}
var urlConfig = {
  img:{
    upload:{
      url:"https://27478500.qcloud.la/uploadimg/attachment/upload"
    }
  },
  wx:{
    msg: {
      sendmessage: {
        url: gConfig.remoteWx + "/msg/sendmessage"
      }
    }
  },
  user:{
    userinfo: {
      url: gConfig.remote+"/user/userinfo"
    }
   },
  unionid: {
    code: {
      url: gConfig.remote +"/unionid/code"
    },
    userinfo: {
      url: gConfig.remote +"/unionid/userinfo"
    }
  },
  product: {
    list: {
      url: gConfig.remote +"/product/list"
    },
    add: {
      url: gConfig.remote +"/product/add"
    }
  },
  pcase: {
    list: {
      url: gConfig.remote +"/case/list"
    },
    detail: {
      url: gConfig.remote +"/case/detail"
    }
  },
  customer: {
    add: {
      url: gConfig.remote +"/customer/addcustomer"
    }
  },
  consult: {
    add: {
      url: gConfig.remote +"/consult/addconsultation"
    },
    list: {
      url: gConfig.remote +"/consult/list"
    },
    trail: {
      url: gConfig.remote +"/consult/trail"
    }
  },
  event: {
    add: {
      url: gConfig.remote +"/event/add"
    }
  }
 
}
module.exports = urlConfig;