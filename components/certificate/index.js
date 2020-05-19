// components/homePage/index.js
const app=getApp();
let util = require('../../utils/utils.js');
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
      // { name: '蜻蜓产品', productId:8, checked:false },
      // { name: '扫码产品', productId: 1, checked: false },
      // { name: 'APP产品', productId: 2, checked: false }
    ],
    index: 0,
    popErrorMsg: '',
    aisle:'',
    tempArr:'',
    snDisplay:'snDisplay'
  },

  attached() {
    let params = {
      url: 'comm/selectProductInfo.do',
      method: 'get',
    }
    util.http(params).then(res => {
      // console.log(res)
      this.setData({
        productArr: res.data,
      })
    }).then(()=>{
      let merchantsInfoStorage = wx.getStorageSync('merchantsInfoStorage');
      // let merchantsInfoStorage = [{ cInfo: 'res.data.cInfo' }, { mInfo: 'res.data.mInfo' }, { pInfo: [{ productId: 8, productRate: 0.5, sn:123}, { productId: 3, productRate: 0.3 }] }]
      console.log(merchantsInfoStorage)
      if (merchantsInfoStorage) {
        this.setData({ tempArr: merchantsInfoStorage[2].pInfo });
        this.setData({ arrObj: merchantsInfoStorage })
        const productArr = this.data.productArr;
        for (let i = 0; i < merchantsInfoStorage[2].pInfo.length; i++) {
          for (let j = 0; j < productArr.length; j++) {
            if (merchantsInfoStorage[2].pInfo[i].productId == productArr[j].productId) {
              let checked = `productArr[${j}].checked`;
              const productRate = `productArr[${j}].productRate`;
              const sn = `productArr[${j}].sn`;
              this.setData({
                [productRate]: merchantsInfoStorage[2].pInfo[i].productRate,
                [checked]: true,
                [sn]: merchantsInfoStorage[2].pInfo[i].sn
              })
              if (productArr[j].productId == 8) {
                this.setData({
                  snDisplay: ''
                });
              }
            }
          }

        }
      }
    })
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navBack() {
      wx.navigateBack({ delta: 1 })
    },
    checkboxChange: function (e) {//签约产品
      const arr = e.detail.value;//console.log(e)
      for (let i=0; i< this.data.productArr.length; i++) {
        // const checked = `productArr[${i}].checked`;
        // this.setData({ [checked]: false, snDisplay: 'snDisplay' });
        this.data.productArr[i].checked = false;
        this.data.productArr[i].snDisplay = 'snDisplay';
      }
      // console.log(this.data.productArr)
      // console.log(arr)
      for(let item of arr){
        // const productId = `productArr[${item}].productId`;
        const checked2 = `productArr[${item}].checked`;
        const productRate = `productArr[${item}].productRate`;
        const sn = `productArr[${item}].sn`;
        let productIdVal = this.data.productArr[item].productId;
        let productRateVal = this.data.productArr[item].productRate;
        let snVal = this.data.productArr[item].sn;
        this.setData({
          [checked2]: true,
          [productRate]: productRateVal||0.38,
          [sn]: snVal||''
         });
        if (productIdVal == 8){
          this.setData({
            snDisplay: ''
          });
        }
      }
      // console.log(this.data.productArr)
    },
    productRate(e) {
      // console.log(e.currentTarget.dataset.index)
      const rateIndex = e.currentTarget.dataset.index; 
      const productRate = `productArr[${rateIndex}].productRate`
      this.setData({ [productRate]: e.detail.value }); //console.log(this.data.productArr)
      if (e.detail.value < 0.25 || e.detail.value > 1) {
        util.tips('请输入0.25-1之间的结算费率!');
        return;
      }
    },
    snInput(e){
      const snIndex = e.currentTarget.dataset.index;
      const sn = `productArr[${snIndex}].sn`
      this.setData({ [sn]: e.detail.value });
    },
    submitFun() {
      let productArr = this.data.productArr; 
      let newArr = [], msg = '', flag = true,checkedNum=0; //console.log(productArr)
      for (let i = 0; i < productArr.length; i++) {
        if (productArr[i].checked) {
          ++checkedNum;
          if (!productArr[i].productRate || productArr[i].productRate < 0.25 || productArr[i].productRate > 1) {
            flag = false;
            msg = `请输入${productArr[i].productName}0.25-1之间的结算费率!`;
            break;
          }else{
            newArr.push(productArr[i]); 
          }
        }
      }
      if (checkedNum == 0) {
        util.tips('请选择产品'); return;
      } else if (!flag){
        util.tips(msg); return;
      }
      // console.log(newArr);return;
      wx.setStorageSync('certificateStorage',  {
        productInfos: JSON.stringify(newArr)
      });
      this.triggerEvent('alertEvent',true)
    },
    back() {
      wx.navigateBack({ delta: -1 });
    }
  }
})