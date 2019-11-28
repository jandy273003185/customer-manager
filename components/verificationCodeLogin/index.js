// components/homePage/index.js
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
    inputValue: null,
    verificationCode:'获取验证码',
    isDisabled: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    accountLogin(){
      wx.navigateTo({ url: '../../pages/accountLogin/accountLogin' });
    },
    clearInput(){
      this.setData({
        'inputValue': ''
      })
    },
    getVerificationCode(e){
      let flag = true;
      let time = 60;
      this.setData({ isDisabled: !this.data.isDisabled});
      this.setData({ verificationCode: time + 's' });

      if (flag) {
        flag = false;
        let timer = setInterval(() => {
          time--;
          this.setData({verificationCode: time + 's'})
          if (time === 0) {
            clearInterval(timer);
            this.setData({verificationCode: '重新获取' });
            this.setData({ isDisabled: !this.data.isDisabled });
            flag = true;
          }
        }, 1000)
      }
    }
  }
})
