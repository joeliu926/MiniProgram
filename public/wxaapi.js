var gConfig={
    /****production start*****/
  //remote:"https://nihaomc.com/wxa",
  //uploadUrl: "https://nihaomc.com/uploadimg/attachment/upload",
  //remoteWx: "https://nihaomc.com/wx",
  /****production start*****/
  //remote:"https://27478500.qcloud.la/wxa",
  //uploadUrl: "https://27478500.qcloud.la/uploadimg/attachment/upload",
  /****production end*****/

  remoteWx: "https://nihaomc.com/wx",
  /****test start*****/
  remote: "https://nihaomc.com/wxa_test",
  uploadUrl: "https://nihaomc.com/uploadimg_test/attachment/upload"
    /****test start*****/
}
var urlConfig = {
  img:{
    upload:{
      url: gConfig.uploadUrl
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
    },
    share: {
      url: gConfig.remote +"/case/share" //
    },

  },
  customer: {
    add: {
      url: gConfig.remote + "/customer/addcustomer" //添加客户
    },
    getcustomer: {
      url: gConfig.remote + "/customer/getcustomer" //获取客户资料getcustomer
    },
    update: {
      url: gConfig.remote + "/customer/update" //更新客户update
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
    singletrail:{
      url: gConfig.remote + "/consult/singletrail" //获取单个用户咨询轨迹
    },
    consultitems: {
      url: gConfig.remote + "/consult/consultitems" //获取咨询项目
    },
    consultcustomers: {
      url: gConfig.remote + "/consult/consultcustomers" //获取一个咨询下面的所有客户
    },
    sharecase: {
      url: gConfig.remote + "/consult/sharecase" //通过会话id获取单次分享的案例ID
    },
    consultantupdate: {
      url: gConfig.remote + "/consult/consultantupdate" // 咨询会话更新接口，可更新会话与案例的关系，会话与项目的关系
    },
    entry: {
      url: gConfig.remote + "/consult/entry" //  客户进入咨询师分享的小程序，对客户信息，线索信息进行维护
    },
    getsharelike: {
      url: gConfig.remote + "/consult/getsharelike" //   查询一次分享中，单个客户对某个案例的点赞状态
    },
    handelsharecase: {
      url: gConfig.remote + "/consult/handelsharecase" // 客户进入咨询师分享的小程序，对某个案例进行点赞操作 或者进行 提交资料给医生操作
    }
  },
  appointment: {
    list: {
      url: gConfig.remote + "/appointment/list" //获取预约列表
    },
    detail: {
      url: gConfig.remote + "/appointment/detail" //获取预约详情
    },
    send: {
      url: gConfig.remote + "/appointment/send" //发起预约
    }
  },
  event: {
    add: {
      url: gConfig.remote +"/event/add"   //分享访问相关接口添加事件
    },
    v2: {
      url: gConfig.remote + "/event/v2"   //v2添加预约相关接口事件
    }
  },
  clue: {
    detail: {
      url: gConfig.remote + "/clue/detail"   //获取线索详情
    }
  }
 
}
module.exports = urlConfig;