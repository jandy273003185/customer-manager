let app = getApp();

/**
 * 封装http 请求方法
 */
const apiUrl = "https://cm.qifenqian.com/";//测试服务器api地址 
// const apiUrl = "http://192.168.1.141:8089/";
const http = (params) => {
  const token = wx.getStorageSync('userStorage').token;
  const userId = wx.getStorageSync('userStorage').userId; //console.log(token, userId)
  //返回promise 对象
  return new Promise((resolve, reject) => {
    wx.request({
      url: apiUrl + params.url,//服务器url+参数中携带的接口具体地址
      data: Object.assign({ roleId: 1 }, { userId: userId},params.data),//请求参数
      header: {
        "token": token,
        "Content-Type": params.contentType || "application/x-www-form-urlencoded"//设置后端需要的常用的格式就好，特殊情况调用的时候单独设置
      },
      method: params.method || 'POST',//默认为GET,可以不写，如常用请求格式为POST，可以设置POST为默认请求方式
      dataType: params.dataType || 'json',//返回的数据格式,默认为JSON，特殊格式可以在调用的时候传入参数
      //responseType: params.responseType,//响应的数据类型
      success: function (res) {
        //接口访问正常返回数据
        if (res.statusCode == 200) {
          //1. 操作成功返回数据,原则上只针对服务器端返回成功的状态（如本例中为000000）
          if (res.data.retCode == "000000") {
            resolve(res.data)
          } else if (params.url == "/order/result" && res.data.retCode == "800020") {//支付结果未知      
            //需要特殊处理的接口，可以单独列出来返回数据
            resolve(res.data)
          } else {
            // wx.showToast({
            //   icon: "none",
            //   title: res.data.retMsg
            // })
            resolve(res.data);
          }
        } else {
          //2. 操作不成功返回数据，以toast方式弹出响应信息，如后端未格式化非操作成功异常信息，则可以统一定义异常提示
          var errMsg = res.data.message
          // errorToast();
          console.log(res.data)
          if (res.data.code == 401) { //token失效
            // wx.navigateTo({ url: '/pages/accountLogin/accountLogin' });
            reLogin();
          }
        }
      },
      fail: function (e) {
        // errorToast();
        console.log(e)
        reject(e)
      }
    })
  })
}
function reLogin() {
  wx.login({
    success: res => {
      console.log(res);
      let params = {
        url: 'user/login',
        method: 'post',
        data: { code: res.code}
      }
      http(params).then(data => {
        console.log(data)
        if (data.token) {
          wx.setStorageSync('userStorage', {
            username: wx.getStorageSync('userStorage').username,
            pwd: wx.getStorageSync('userStorage').pwd,
            openId: wx.getStorageSync('userStorage').openId,
            userId: wx.getStorageSync('userStorage').userId,
            token: data.token
          });
          wx.navigateTo({ url: '/pages/accountLogin/accountLogin' })
        }else{
          wx.showToast({
            title: '服务器异常,请稍后重试！',
            icon: 'none',
            duration: 3000
          })
        } 
      });
    }
  })
}

function imgUpload(params){//图片上传
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url: apiUrl + params.url,
      filePath: params.tempFilePaths,
      name: 'file',
      header: {
        "token": wx.getStorageSync('userStorage').token,
        "Content-Type": params.contentType || "application/x-www-form-urlencoded"
      },
      success: function (res) {
        resolve(res.data);
      }
    })
  })
}

function dateFormat(fmt, date) {
  let ret;
  let opt = {
    "Y+": date.getFullYear().toString(),        // 年
    "m+": (date.getMonth() + 1).toString(),     // 月
    "d+": date.getDate().toString(),            // 日
    "H+": date.getHours().toString(),           // 时
    "M+": date.getMinutes().toString(),         // 分
    "S+": date.getSeconds().toString()          // 秒
    // 有其他格式化字符需求可以继续添加，必须转化成字符串
  };
  for (let k in opt) {
    ret = new RegExp("(" + k + ")").exec(fmt);
    if (ret) {
      fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
    };
  };
  return fmt;
}

function calculateDay(num) {//计算天数
  if (!num) { num = 0 }
  const date1 = new Date();
  const time1 = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate()
  const date2 = new Date(date1);
  date2.setDate(date1.getDate() - num);
  return date2.getFullYear() + "-" + formatNumber(date2.getMonth() + 1) + "-" + formatNumber(date2.getDate());
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function mobile(val) {//验证手机号
  const phoneReg = /^1[3-578]\d{9}$/;
  if (phoneReg.test(val)) {
    return true;
  } else {
    return false;
  }
}
function mobileEmail(val) {//验证手机号或邮箱
  const phoneReg = /^1[3-578]\d{9}$/;
  const emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
  if (phoneReg.test(val) || emailReg.test(val)) {
    return true;
  } else {
    return false;
  }
}
function tel(val){//座机
  const regTel1 = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;//带区号的固定电话
  const regTel2 = /^(\d{7,8})(-(\d{3,}))?$/;//不带区号的固定电话
  const phoneReg = /^1[3-578]\d{9}$/;
  if (regTel1.test(val) || regTel2.test(val) || phoneReg.test(val)) {
    return true;
  }else{
    return false;
  } 
}
function iDcard(val) {//身份证
  const regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (regIdNo.test(val)) {
    return true;
  } else {
    return false;
  }
}
function nameVerifycation(val){//姓名
  const regName = /^[\u4e00-\u9fa5]{2,4}$/;
  const regName2 = /^[a-zA-Z0-9]{0,10}$/;
  // const regName = "([\\u4e00-\\u9fa5]{1}[\\u4e00-\\u9fa5\.·。]{4,10}[\\u4e00-\\u9fa5]{1}$)|([a-zA-Z]{1}[a-zA-Z\\-]{4,10}[a-zA-Z]{1}$)";
  if (regName.test(val) || regName2.test(val)) {
    return true;
  } else {
    return false;
  } 
}

function bankNo(val) {//银行卡号
  const regBank = /^(\d{16}|\d{19})$/;
  if (regBank.test(val)) {
    return true;
  } else {
    return false;
  }
}

let wxCommon = {}; //定义全局域为wx全局
wxCommon.listApi = {};  //初始化wx全局api
//挂载获取系统属性api
wxCommon.listApi.getSystemInfo = function (suc, fail) {
  var res = wx.getSystemInfoSync();
  if (res && typeof (res) === "object") {
    suc(res);
  }else {
    fail(res);
  }
}

function ohShitfadeOut() {//错误提示
  let fadeOutTimeout = setTimeout(()=> {
    this.setData({ popErrorMsg: '' });
    clearTimeout(fadeOutTimeout);
  }, 3000);
}

/*节流*/
function throttle(fn, interval) {
  var enterTime = 0;//触发的时间
  var gapTime = interval || 300;//间隔时间，如果interval不传，则默认300ms
  return function () {
    var context = this;
    var backTime = new Date();//第一次函数return即触发的时间
    if (backTime - enterTime > gapTime) {
      fn.call(context, arguments);
      enterTime = backTime;//赋值给第一次触发的时间，这样就保存了第二次触发的时间
    }
  };
}

/*防抖*/
function debounce(fn, interval) {
  var timer;
  var gapTime = interval || 1000;//间隔时间，如果interval不传，则默认1000ms
  return function () {
    clearTimeout(timer);
    var context = this;
    var args = arguments;//保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
    timer = setTimeout(function () {
      fn.call(context, args);
    }, gapTime);
  };
}

module.exports = {
  dateFormat: dateFormat,
  calculateDay: calculateDay,
  mobileEmail: mobileEmail,
  tel:tel,
  iDcard: iDcard,
  nameVerifycation: nameVerifycation,
  mobile: mobile,
  bankNo: bankNo,
  http: http,
  wxCommon: wxCommon,
  ohShitfadeOut: ohShitfadeOut,
  imgUpload: imgUpload,
  throttle: throttle,
  debounce: debounce
}