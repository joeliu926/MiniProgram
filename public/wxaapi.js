var gConfig={
  remoteWx: "https://nihaomc.com/wx_test",
  remote: "https://nihaomc.com/wxa_test",
  uploadUrl: "https://nihaomc.com/uploadimg_test/attachment/upload"
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
    morelist: {
      url: gConfig.remote + "/case/morelist" //获取多案例列表
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
      url: gConfig.remote + "/customer/update" //更新客户
    },
    getcustomerbyunid: {
      url: gConfig.remote + "/customer/getcustomerbyunid" //通过咨询师unionid和客户unionid获取客户信息
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
    handlelike:{
      url: gConfig.remote + "/consult/handlelike"   //用户操作喜欢不喜欢  
    },
    gethandlelike: {
      url: gConfig.remote + "/consult/gethandlelike"   //获取操作喜欢不喜欢  
    },
    interactlist: {
      url: gConfig.remote + "/consult/interactlist"   //线索 互动列表
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
    },
    getpostphoto: {
      url: gConfig.remote + "/consult/getpostphoto" // 获取用户上传的头像图片 
    },
    getconsultinfo: {
      url: gConfig.remote + "/consult/getconsultinfo" // 通过会话id获取咨询师信息
    },
    getcluesbyconsultid: {
      url: gConfig.remote + "/consult/getcluesbyconsultid" // 获取目标人群接口V0.3.3
    },
    addconsultrecord: {
      url: gConfig.remote + "/consult/addconsultrecord" //  保存活动目标人群接口
    },
    getrecordnum:{
      url: gConfig.remote + "/consult/getrecordnum" //  获取收礼客户
    },
    getprompt: {
      url: gConfig.remote + "/consult/getprompt" //  获取M和N
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
    },
  
  },
  clinic: {
    detail: {
      url: gConfig.remote + "/clinic/detail"   //获取诊所详情
    }
  },
  index:{
    cluelist: {
      url: gConfig.remote + "/index/cluelist"   //获取线索列表
    },
    cluedetail: {
      url: gConfig.remote + "/index/cluedetail"   //获取线索详情
    },
    
    sharelist: {
      url: gConfig.remote + "/index/sharelist"   //场景列表
    },
    clueremark: {
      url: gConfig.remote + "/index/clueremark"   //线索备注
    },
    remarklist: {
      url: gConfig.remote + "/index/remarklist"   //备注列表
    },
   
    clueclose: {
      url: gConfig.remote + "/index/clueclose"   //线索关闭
    },
    linkmanupdate: {
      url: gConfig.remote + "/index/linkmanupdate"   //联系人更新
    },
    linkman: {
      url: gConfig.remote + "/index/linkman"   //联系人信息
    },
    waitflow: {
      url: gConfig.remote + "/index/waitflow"   //待跟进
    }
  },
  posterinfo:{
    addposter:{
      url: gConfig.remote + "/posterinfo/addposter"   //新建海报
    }, 
    pagelist: {
      url: gConfig.remote + "/posterinfo/pagelist"   //海报列表查询
    },
    posterdel: {
      url: gConfig.remote + "/posterinfo/posterdel"   //海报删除
    },
    createposter:{
      url: gConfig.remote + "/api/createposter"//创建保存海报图片
    },
    deleteposter:{
      url: gConfig.remote + "/api/deleteposter"//删除生成的海报图片 
    }
  },
  postercategory: {
    addorupdate: {
      url: gConfig.remote + "/postercategory/addorupdate"   //添加、修改海报分类
    }, list: {
      url: gConfig.remote + "/postercategory/list"   //分类列表查询
    }
  },
  wxaqr:{
    genwxaqrcode:{
      url: gConfig.remote + "/wxaqr/genwxaqrcode"
    },
    addformid:{
      url: gConfig.remote + "/wxa/formid"
    },
    gConfig:{
      route: gConfig.remote
    }
  },
  gift:{
    pagelist:{
      url: gConfig.remote + "/gift/pagelist"  //获取礼品列表 
    },
    giftdetail: {
      url: gConfig.remote + "/gift/giftdetail"  //获取礼品详情 giftdetail
    }
  },
  activityrecord: {
    create: {
      url: gConfig.remote + "/activityrecord/create"  //保存领取记录 
    },
    getnum: {
      url: gConfig.remote + "/activityrecord/getnum"  //领取总数 
    },
    pagelist: {
      url: gConfig.remote + "/activityrecord/pagelist"  // 获取列表 
    },
    getdetail: {
      url: gConfig.remote + "/activityrecord/getdetail"  //获取领取详情 
    },
    getalreadyappointmentnum: {
      url: gConfig.remote + "/activityrecord/getalreadyappointmentnum"  // 已经领取总数  
    },
    getbubbleprompt: {
      url: gConfig.remote + "/activityrecord/getbubbleprompt"  // 气泡  
    }
  }
}
module.exports = urlConfig;