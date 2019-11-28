App({
  globalData: {
    pageName:'',
    showTips:false,
    showTips2: false,
    popErrorMsg:''
  },
  onLaunch: function () {
      // wx.switchTab({
      //   url: '/pages/homePage/homePage'
      // })
      // Promise.resolve().then(function () {
      //   return this.openID();
      // }).then(function(){
      //   return this.token();
      // })
      /*wx.login({
        success: res => {
          let params = {
            url: 'user/login',
            method: 'post',
            data: {
              code: res.code,
            }
          }
          Promise.resolve().then(() => {
            // return util.http(params).then(data => {
            //   if (data) {
            //     this.setData({
            //       openId: data.data,
            //       hide: 'hide'
            //     });
            //   }
            // })
          }).then(() => {
            let params = {
              url: 'user/loginBinding',
              method: 'post',
              data: {
                // userName: wx.getStorageSync('userStorage').username,
                // password: wx.getStorageSync('userStorage').pwd,
                openId: wx.getStorageSync('userStorage').openId,
                roleCode: 'cust'
              }
            }
            console.log(params)
            util.http(params).then(data => {
              if (data) {
                console.log(data)
                if (data.code == 200) {
                  // this.setData({ token: data.data.token});
                  if (!wx.getStorageSync('userStorage').username) {
                    wx.setStorageSync('userStorage', {
                      username: this.data.mobileValue,
                      pwd: this.data.pwdValue,
                      openId: this.data.openId,
                      userId: data.data.user.userId,
                      token: data.data.token
                    });
                    // console.log(wx.getStorageSync('userStorage'));
                  }
                  wx.switchTab({ url: '/pages/homePage/homePage' });
                } else {
                  // this.setData({ popErrorMsg: data.msg });
                  // util.ohShitfadeOut();
                  // wx.showToast({
                  //   title: data.msg,
                  //   icon: 'none',
                  //   duration: 3000
                  // })
                }
              }
            })
          }, rejected => {
            wx.showToast({
              title: '服务器异常,请稍后重试！',
              icon: 'none',
              duration: 3000
            })
          }
          )
        }
      })*/
    
    // let menuButtonObject = wx.getMenuButtonBoundingClientRect();
    // wx.getSystemInfo({
    //   success: res => {
    //     let statusBarHeight = res.statusBarHeight,
    //       navTop = menuButtonObject.top,//胶囊按钮与顶部的距离
    //       navHeight = statusBarHeight + menuButtonObject.height + (menuButtonObject.top - statusBarHeight) * 2;//导航高度
    //     this.globalData.navHeight = navHeight;
    //     this.globalData.navTop = navTop;
    //     this.globalData.windowHeight = res.windowHeight;
    //   },
    //   fail(err) {
    //     console.log(err);
    //   }
    // })
  }
})