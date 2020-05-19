// components/homePage/index.js
let util = require('../../utils/utils.js');
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    mobileValue: null,
    pwdValue: null,
    isDisabled: true,
    mobileFlag:false,
    pwdFlag: false,
    popErrorMsg:'',
    hide: '',
    code:'',
    openId:'',
    userId:''
  },

  attached() {
    let userStorage = wx.getStorageSync('userStorage');
    if (userStorage.username && userStorage.token) {
      wx.switchTab({
        url: '/pages/homePage/homePage'
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel() {//微信授权-拒绝
      // wx.navigateTo({
      //   url: '/pages/accountLogin/accountLogin?flag=true',
      // })
      wx.navigateBack({
        delta: -2
      }) 
      this.setData({
        hide: 'hide'
      });
    },
    confirmSubmit() {//微信授权-允许
      this.openID();
    },
    openID(){
      wx.login({
        success: res => {
          console.log(res);

          let params = {
            url: 'user/login',
            method: 'post',
            data: {
              code: res.code,
            }
          }
          this.setData({
            code: res.code ,
          });
          // console.log(params);
          util.http(params).then(res => {
            console.log(res)
            if (res.user && res.token) {
              wx.setStorageSync('userStorage', {
                username: res.user.userCode,
                pwd: res.user.password,
                openId: res.openId,
                userId: res.user.userId,
                token: res.token
              });
              wx.switchTab({ url: '/pages/homePage/homePage' });
            }else{
              this.setData({
                openId: res.data,
                hide: 'hide'
              });
            }    
          }, rejected => {
            wx.showToast({
              title: '服务器异常,请稍后重试！',
              icon: 'none',
              duration: 3000
            })
          });
        }
      })
    },
    verificationCodeLogin(){
      wx.navigateTo({ url: '../../pages/verificationCodeLogin/verificationCodeLogin' });
    },
    clearMobileInput() {
      this.setData({ 
        mobileValue: '',
        mobileFlag:false,
        isDisabled: true 
      });
    },
    clearPwdInput() {
      this.setData({
        pwdValue: '',
        pwdFlag: false,
        isDisabled: true 
      });
    },
    isAccountAvailable(e) {//验证手机号或邮箱
      // const phoneReg = /^1[3-578]\d{9}$/;
      // const emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
      // this.setData({ 'mobileValue': e.detail.value });
      // if (phoneReg.test(e.detail.value) || emailReg.test(e.detail.value)) {
      //   this.setData({ 'mobileFlag': true });
      //   console.log();
      //   if (this.data.pwdFlag){
      //     this.setData({ isDisabled: false });
      //   }
      // } else {
      //   this.setData({ 'mobileFlag': false });
      //   this.setData({ isDisabled: true });
      // }
      this.setData({ mobileValue: e.detail.value });
      if (this.data.mobileValue) {
        this.setData({ mobileFlag: true });
        if (this.data.pwdFlag){
          this.setData({ isDisabled: false });
        }
      }else {
        this.setData({ mobileFlag: false });
        this.setData({ isDisabled: true });
      }
    },
    isPwdAvailable(e){//验证密码(字母+数字:6至16位)
      // const pwdReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
      // this.setData({ 'pwdValue': e.detail.value });
      // if (pwdReg.test(e.detail.value)) {
      //   this.setData({ 'pwdFlag': true });
      //   if (this.data.mobileFlag){
      //     this.setData({ isDisabled: false });
      //   }
      // } else {
      //   this.setData({ 'pwdFlag': false });
      //   this.setData({ isDisabled: true });
      // }
      this.setData({ pwdValue: e.detail.value });
      if (this.data.pwdValue) {
        this.setData({ pwdFlag: true });
        if (this.data.mobileFlag) {
          this.setData({ isDisabled: false });
        }
      }else {
        this.setData({ pwdFlag: false });
        this.setData({ isDisabled: true });
      }
    },
    bindClick(){//绑定
      this.token();
    },
    token(){
      let params = {
        url: 'user/loginBinding',
        method: 'post',
        data: {
          userName: wx.getStorageSync('userStorage').username == undefined ? this.data.mobileValue : wx.getStorageSync('userStorage').username,
          password: wx.getStorageSync('userStorage').pwd == undefined ? this.data.pwdValue : wx.getStorageSync('userStorage').pwd,
          openId: wx.getStorageSync('userStorage').openId == undefined ? this.data.openId : wx.getStorageSync('userStorage').openId,
          roleCode: 'cust'
        }
      }
      console.log(params)
      util.http(params).then(data => {
        if (data) {
          console.log(data)
          if (data.code == 200) {
            if (!wx.getStorageSync('userStorage').username){
              wx.setStorageSync('userStorage', {
                username: this.data.mobileValue,
                pwd: this.data.pwdValue,
                openId: this.data.openId,
                userId: data.data.user.userId,
                token: data.data.token
              });
            }
            wx.switchTab({ url: '/pages/homePage/homePage' });
          } else {
            // this.setData({ popErrorMsg: data.msg });
            // util.ohShitfadeOut();
            wx.showToast({
              title: data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      }, rejected => {
        wx.showToast({
          title: '服务器异常,请稍后重试！',
          icon: 'none',
          duration: 3000
        })
      })
    }
  },
})
