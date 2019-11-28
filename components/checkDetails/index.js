// components/homePage/index.js
let util = require('../../utils/utils.js');
let app = new getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    custId: {
      type: "String",
      value: '',
      observer: function (news, olds, path) {
        this.setData({ custId: news})
          let params = {
            url: 'comm/getCommerAuditCause.do',
            method: 'get',
            data: {
              custId: news,
            }
          }
          console.log(params)
          util.http(params).then(data => {
            if (data) {
              console.log(data)
              let arr = [];
              for(let i=0; i<data.length; i++){
                this.setData({ time: data[i].audit_time })
                arr.push(Number(i+1)+"、"+data[i].message);
              }
              this.setData({ details:arr})
              
            }
          })
        }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '详情',
    custId:'',
    time:'',
    details:[]
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
    navBack() {
      wx.navigateBack({ delta: 1 })
    },
    updateInfo(){
      wx.navigateTo({ url: '/pages/merchantsIntoPieces/merchantsIntoPieces?custId=' + this.data.custId });
    },
    back(){
      wx.navigateBack({delta: 1})
    },
  }
})
