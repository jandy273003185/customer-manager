// components/alert/index.js
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
    popErrorMsg: app.globalData.popErrorMsg
  },
  attached(){
  
  },
  /**
   * 组件的方法列表
   */
  methods: {
    ohShitfadeOut() {//错误提示
      let fadeOutTimeout = setTimeout(() => {
        // this.setData({ popErrorMsg: '' });
        app.globalData.popErrorMsg = "";
        clearTimeout(fadeOutTimeout);
      }, 3000);
    }
  }
})
