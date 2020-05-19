// components/alert/index.js
let util = require('../../utils/utils.js');
let app = new getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    alert: {
      type: "String",
      value: '',
      observer: function (news, olds, path) {
        console.log(news)
        if (news){
        }
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    isHide: '',
    popErrorMsg: '',
    tdCustInfo:{},
    state: '',
    url:''
  },
  attached(){
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    save(){//仅保存
      // console.log(this.data.storage);
      this.setData({state: '05'})
      this.addMerchant();
    },
    confirmSubmit(){//确认提交
      this.setData({ state: '01' })
      this.addMerchant();
    },
    cancel(){//取消
      wx.removeStorageSync('basicStorage');
      wx.removeStorageSync('legalPersonStorage');
      wx.removeStorageSync('billingStorage');
      wx.removeStorageSync('certificateStorage');
      wx.removeStorageSync('basicImgStorage');
      wx.removeStorageSync('legalPersonImgStorage');
      wx.removeStorageSync('billingImgStorage');
      wx.removeStorageSync('merchantsInfoStorage');
      wx.removeStorageSync('merchantsInfoStorage2');
      this.setData({isHide:'hide'});
      this.triggerEvent("myevent", { isHide: false })
      this.triggerEvent("myevent2", { isHide: false })
    },
    storage(){
      let newObj = {};
      let basicStorage = wx.getStorageSync('basicStorage');
      let legalPersonStorage = wx.getStorageSync('legalPersonStorage');
      let billingStorage = wx.getStorageSync('billingStorage');
      let certificateStorage = wx.getStorageSync('certificateStorage');
      let arr = wx.getStorageSync('basicImgStorage');
      let arr2 = wx.getStorageSync('legalPersonImgStorage');
      let arr3 = wx.getStorageSync('billingImgStorage');
      let merchantsInfoStorage2 = wx.getStorageSync('merchantsInfoStorage2');
      if (merchantsInfoStorage2) {
        this.setData({ 'tdCustInfo': merchantsInfoStorage2, url:'comm/insertProduct.do'});
      } else {
        this.setData({ 'tdCustInfo': Object.assign(newObj, basicStorage, legalPersonStorage, billingStorage, certificateStorage, { custScanCopys: JSON.stringify([...arr, ...arr2, ...arr3]) }, { createId: wx.getStorageSync('userStorage').userId }, { state: this.data.state }), url: 'comm/addMerchant.do' });
      }
      // console.log(this.data.tdCustInfo);
    },
    addMerchant(){
      this.triggerEvent("myevent", { isHide: false })
      this.triggerEvent("myevent2", { isHide: false })
      /*let obj = this.data.tdCustInfo;
      let basicObj = {},flag = false;
      for(let key in obj){
        if (!obj[key]){
          console.log(key, obj[key]);
          if (key == 'contactPhone' || key == 'merchantAccount' || key == 'shopInterior') {
            flag = true;
            basicObj.key;
          }
        }
      }
      if (flag){
        wx.navigateTo({ url: '/pages/merchantsIntoPieces/merchantsIntoPieces?basicObj=' + basicObj });
        return;
      }*/
      let all =  {
        merchantAccount:  '15611111150',
        custType:  '0',
        custName:  '七月有风',
        shortName:  '11',
        contactPhone:  '1111',
        province:  '江西省',
        city:  '赣州市',
        country:  '章贡区',
        custAdd:  '经济开发区',
        businessLicense:  'S0612018016288G',
        businessTermStart:  '2018-11-13',
        businessTermEnd:  '长期',
        representativeName:  "Holly",
        representativeCertNo:  "441802198909126920",
        idTermStart:  "2017.11.29",
        idTermEnd:  "2037.11.29",
        contactName:  "Hollu",
        contactMobile:  '15948545422',
        compMainAcct:  "622021510009214444",
        compAcctBank:  "工商银行",
        bankProvinceName: "江西省",
        bankCityName:  "赣州市",
        branchBank:  "大余支行",
        compMainAcctType:  "02",
        dragonfly:  null,
        scan:  true,
        app:  "",
        createId: "25",
        custScanCopys: JSON.stringify([{ scanCopyPath: 11111111, flag: 1, certifyType: 2, certifyNo: 3 }]),
        productInfos: JSON.stringify([
          { productId: 8 , productRate: 0.1 ,sn: '1001' },
          { productId: 1, productRate: 0.2, sn: '' },
          { productId: 2, productRate: 0.3, sn: '' }
        ])
       };
      this.storage();
      let params = {
        url: this.data.url,
        method: 'post',
        // contentType: 'application/json',
        data: this.data.tdCustInfo,
        // data:all
      };
      console.log(params);
      wx.removeStorageSync('basicStorage');
      wx.removeStorageSync('legalPersonStorage');
      wx.removeStorageSync('billingStorage');
      wx.removeStorageSync('certificateStorage');
      wx.removeStorageSync('basicImgStorage');
      wx.removeStorageSync('legalPersonImgStorage');
      wx.removeStorageSync('billingImgStorage');
      wx.removeStorageSync('merchantsInfoStorage');
      wx.removeStorageSync('merchantsInfoStorage2');
      this.setData({ isHide: 'hide' });
      wx.getNetworkType({//获取网络状态
        success: (res) => {
          if (res.networkType == 'none') {
            wx.showToast({
              title: '网络异常,请稍后重试！',
              icon: 'none',
              duration: 3000
            })
          } else {

          }
        }
      })
      util.http(params).then(data => {
        if (data) {console.log(data)
          if (data.code == 200) {
            app.globalData.showTips2 = false;
            if (app.globalData.pageName == 'commercialTenant') {
              this.triggerEvent('myRefresh')
              wx.switchTab({
                url: '/pages/commercialTenant/commercialTenant',
              })
            } else if (app.globalData.pageName == 'searchCommercialTenant') {
              this.triggerEvent('myRefresh')
              wx.navigateTo({
                url: '/pages/searchCommercialTenant/searchCommercialTenant',
              })
            } else {
              this.triggerEvent('myRefresh')
              wx.switchTab({
                url: '/pages/homePage/homePage',
              })
            }
          } else if (data.code == 300){
            wx.showToast({
              title: data.data.message,
              icon: 'none',
              duration: 3000
            })
            this.triggerEvent('myEvent', { 'msg': data.data.message });
            return;
          }
        }
      }, rejected => {
        wx.showToast({
          title: '服务器异常,请稍后重试！',
          icon: 'none',
          duration: 3000
        })
        return;
      })
      
      
    }
  }
})
