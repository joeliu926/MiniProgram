var gConfig={
  //remote:"https://27478500.qcloud.la/wxa",
  remoteWx: "https://27478500.qcloud.la/wx",
  remote: "https://27478500.qcloud.la/wxa_test",
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
      url: gConfig.remote +"/case/list" //获取案例列表
    },
    detail: {
      url: gConfig.remote +"/case/detail" //项目案例详情
    }
  },
  customer: {
    add: {
      url: gConfig.remote +"/customer/addcustomer" //添加客户
    }
  },
  consult: {
    add: {
      url: gConfig.remote + "/consult/addconsultation" //添加会话信息
    },
    list: {
      url: gConfig.remote + "/consult/list" //获取咨询列表
    },
    trail: {
      url: gConfig.remote + "/consult/trail" //获取所有咨询轨迹
    },
    consultitems: {
      url: gConfig.remote + "/consult/consultitems" //获取咨询项目
    },
    consultcustomers: {
      url: gConfig.remote + "/consult/consultcustomers" //获取一个咨询下面的所有客户
    }
  },
  event: {
    add: {
      url: gConfig.remote +"/event/add"   //添加事件
    }
  }
 
}
module.exports = urlConfig;