// components/homePage/index.js
const app=getApp();
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
    title: '商户进件',
    isHide: false,
    productArr:[
      { name: '蜻蜓产品', productId:8, checked:false },
      { name: '扫码产品', productId: 1, checked: false },
      { name: 'APP产品', productId: 2, checked: false }
    ],
    index: 0,
    popErrorMsg: '',
    rate:'0.38',
    rate2: '0.38',
    rate3: '0.38',
    aisle:'',
    tempArr:'',
    sn:''
  },

  attached() {
    let merchantsInfoStorage = wx.getStorageSync('merchantsInfoStorage');
    // let merchantsInfoStorage = [{ cInfo: 'res.data.cInfo' }, { mInfo: 'res.data.mInfo' }, { pInfo: [{ productId: 8, productRate: 0.1 },  { productId: 2, productRate: 0.3 }] }]
    console.log(merchantsInfoStorage)
    if (merchantsInfoStorage) {
      this.setData({ tempArr: merchantsInfoStorage[2].pInfo});
      this.setData({ arrObj: merchantsInfoStorage })
      let checked1 = 'productArr[0].checked';
      let checked2 = 'productArr[1].checked';
      let checked3 = 'productArr[2].checked';
      // let productId1 = 'productArr[0].productId';
      // let productId2 = 'productArr[1].productId';
      // let productId3 = 'productArr[2].productId';
      let checked4 = '', checked5 = '', checked6 = ''; 
      for (let i = 0; i < merchantsInfoStorage[2].pInfo.length; i++){
        if (merchantsInfoStorage[2].pInfo[i].productId == 8) {
          this.setData({
            // [productId1]: merchantsInfoStorage[2].pInfo[0].productId,
            rate: merchantsInfoStorage[2].pInfo[i].productRate,
            [checked1]: true,
            sn: merchantsInfoStorage[2].pInfo[i].sn
          })
        } else if (merchantsInfoStorage[2].pInfo[i].productId == 1){
          this.setData({
            rate2: merchantsInfoStorage[2].pInfo[i].productRate,
            [checked2]: true,
          })
        } else if (merchantsInfoStorage[2].pInfo[i].productId == 2){
          this.setData({
            rate3: merchantsInfoStorage[2].pInfo[i].productRate,
            [checked3]: true,
          })
        }
      }  
      // }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navBack() {
      wx.navigateBack({ delta: 1 })
    },
    checkboxChange: function (e) {//签约产品
      let arr = e.detail.value;
      let newArr = [];
      //console.log(arr)
      for(let item of arr){
        let obj={};
        obj.productId = item;
        newArr.push(obj);
      }
      this.setData({ tempArr: newArr});
    },
    rate(e) { 
      if (e.detail.value >= 0.25 && e.detail.value <= 1){
        this.setData({ rate: e.detail.value });
      }else{
        wx.showToast({
          title: "请输入0.25-1之间的结算费率！",
          icon: 'none',
          duration: 3000
        })
        return;
      }
    },
    rate2(e) { 
      if (e.detail.value >= 0.25 && e.detail.value <= 1) {
        this.setData({ rate2: e.detail.value });
      } else {
        wx.showToast({
          title: "请输入0.25-1之间的结算费率！",
          icon: 'none',
          duration: 3000
        })
        return;
      }
    },
    rate3(e) { 
      if (e.detail.value >= 0.25 && e.detail.value <= 1) {
        this.setData({ rate3: e.detail.value });
      } else {
        wx.showToast({
          title: "请输入0.25-1之间的结算费率！",
          icon: 'none',
          duration: 3000
        })
        return;
      }
    },
    snInput(e){
      this.setData({ sn: e.detail.value })
    },
    submitFun() {
      let tempArr = this.data.tempArr; //console.log(tempArr)
      let newArr = [], msg = '',flag = true; 
      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i].productId == 8) {
          if (!this.data.rate || this.data.rate < 0.25 || this.data.rate > 1) {
            flag = false;
            msg = "请正确输入蜻蜓产品的结算费率!";
            // this.setData({ popErrorMsg: msg });
            // this.ohShitfadeOut();
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 3000
            })
            break;
          }
          newArr.push({ productId: 8, productRate: this.data.rate, sn: this.data.sn });
        } else if (tempArr[i].productId == 1) {
          if (!this.data.rate2 || this.data.rate2 < 0.25 || this.data.rate2 > 1) {
            flag = false;
            msg = "请正确输入扫码产品的结算费率!";
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 3000
            })
            break;
          }
          newArr.push({ productId: 1, productRate: this.data.rate2, sn: '' });
        } else if (tempArr[i].productId == 2) {
          if (!this.data.rate3 || this.data.rate3 < 0.25 || this.data.rate3 > 1) {
            flag = false;
            msg = "请正确输入APP产品的结算费率!";
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 3000
            })
            break;
          }
          newArr.push({ productId: 2, productRate: this.data.rate3, sn: '' });
        }
      }
      //console.log(newArr)
      //return;
      if (tempArr.length == 0) {
        // this.setData({ popErrorMsg: "请选择产品!" });
        // this.ohShitfadeOut();
        wx.showToast({
          title: "请选择产品",
          icon: 'none',
          duration: 3000
        })
        return;
      } else if (!flag){
        // this.setData({ popErrorMsg: msg });
        // this.ohShitfadeOut();
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 3000
        })
        return;
      }

      wx.setStorageSync('certificateStorage',  {
        productInfos: JSON.stringify(newArr)
      });
      this.triggerEvent('alertEvent',true)
      
      // app.globalData.showTips2=true;
      // if (app.globalData.pageName == 'commercialTenant'){
      //   wx.switchTab({
      //     url: '/pages/commercialTenant/commercialTenant',
      //   })
      // } else if (app.globalData.pageName == 'searchCommercialTenant') {
      //   // wx.switchTab({
      //   //   url: '/pages/searchCommercialTenant/searchCommercialTenant',
      //   // })
      //   wx.navigateTo({
      //     url: '/pages/searchCommercialTenant/searchCommercialTenant',
      //   })
      // } else{
      //   wx.switchTab({
      //     url: '/pages/homePage/homePage',
      //   })
      // }
    },
    back() {
      wx.navigateBack({ delta: 1 });
    }
    // ohShitfadeOut() {//错误提示
    //   let fadeOutTimeout = setTimeout(() => {
    //     this.setData({ popErrorMsg: '' });
    //     clearTimeout(fadeOutTimeout);
    //   }, 3000);
    // }
  }
})