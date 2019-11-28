// components/navbar/index.js
const App = getApp();

Component({
  options: {

  },
  /**
   * 组件的属性列表
   */
  properties: {
  
  },

  /**
   * 组件的初始数据
   */
  data: {
    title:''
  },
  lifetimes: {
    attached: function () {
      
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //回退
    navBack: function () {
      wx.navigateBack({
        delta: 1
      })
    },
    //回主页
    toIndex: function () {
      wx.navigateTo({
        url: '/pages/admin/home/index/index'
      })
    },
  }
})