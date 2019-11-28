// components/homePage/index.js
let util = require('../../utils/utils.js');
const app=getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    pageName: {
      type: "String",
      value: '',
      observer: function (news, olds, path) {
        console.log(news)
        app.globalData.pageName = news;
      }
    },
    custId: {
      type: "String",
      value: '',
      observer: function (news, olds, path) {
        if (news) {
          this.setData({ custId: news })
          let params = {
            url: 'comm/queryMerchant.do',
            method: 'get',
            data: {
              custId: news,
            }
          }
          // console.log(params)
          util.http(params).then(res => {
            console.log(res)
            if (res.code == 200) {
              // console.log(wx.getStorageSync('merchantsInfoStorage2'));
              // wx.removeStorageSync('merchantsInfoStorage2');
              wx.setStorageSync('merchantsInfoStorage2', [{ cInfo: res.data.cInfo }, { mInfo: res.data.mInfo }, { pInfo: res.data.pInfo }, { provinces: res.data.provinces }, { bankProvinces: res.data.bankProvinces }, { uri: res.data.uri }, { url: res.data.url }, { banks: res.data.banks }]);
              this.setData({ arrObj: [{ cInfo: res.data.cInfo }, { mInfo: res.data.mInfo }, { pInfo: res.data.pInfo }, { provinces: res.data.provinces }, { bankProvinces: res.data.bankProvinces }, { uri: res.data.uri }, { url: res.data.url }, { banks: res.data.banks }] })


              let provinceId = res.data.provinces[0].provinceId;
              let cityId = res.data.provinces[0].cityId;
              let areaId = res.data.provinces[0].areaId;
              let endDate = null, time = null, checked = '';
              if (res.data.mInfo.businessTermEnd == '长期') {
                endDate = '日期选择';
                checked = true;
                time = res.data.mInfo.businessTermEnd;
                this.setData({ radioVal: 1 });
              } else {
                endDate = res.data.mInfo.businessTermEnd;
                time = res.data.mInfo.businessTermEnd;
                this.setData({ radioVal: 0 });
              }
              let photoImg = 'photoArr[0].photoImg', uploadImg = 'photoArr[0].uploadImg', photoTxt = 'photoArr[0].photoTxt';
              let photoImg2 = 'photoArr[1].photoImg', uploadImg2 = 'photoArr[1].uploadImg', photoTxt2 = 'photoArr[1].photoTxt';
              let photoImg3 = 'photoArr[2].photoImg', uploadImg3 = 'photoArr[2].uploadImg', photoTxt3 = 'photoArr[2].photoTxt';
              let photoImg4 = 'photoArr[3].photoImg', uploadImg4 = 'photoArr[3].uploadImg', photoTxt4 = 'photoArr[3].photoTxt';
              let photoImg5 = 'photoArr[4].photoImg', uploadImg5 = 'photoArr[4].uploadImg', photoTxt5 = 'photoArr[4].photoTxt';
              let photoImg6 = 'photoArr[5].photoImg', uploadImg6 = 'photoArr[5].uploadImg', photoTxt6 = 'photoArr[5].photoTxt';
              let img = '', img2 = '', img3 = '', img4 = '', img5 = '', img6 = '';
              for (let i = 0; i < res.data.cInfo.length; i++) {
                if (res.data.cInfo[i].certifyType == '02' && res.data.cInfo[i].scanCopyPath) {
                  img = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath;
                  this.setData({ [uploadImg]: 'upload-img', [photoTxt]: false, flag1: 2 });
                } else if (res.data.cInfo[i].certifyType == '08' && res.data.cInfo[i].scanCopyPath) {
                  img2 = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath; this.setData({ [uploadImg2]: 'upload-img', [photoTxt2]: false, flag2: 2 });
                } else if (res.data.cInfo[i].certifyType == '18' && res.data.cInfo[i].scanCopyPath) {
                  img3 = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath; this.setData({ [uploadImg3]: 'upload-img', [photoTxt3]: false, flag3: 2 });
                } else if (res.data.cInfo[i].certifyType == '11' && res.data.cInfo[i].scanCopyPath) {
                  img4 = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath; this.setData({ [uploadImg4]: 'upload-img', [photoTxt4]: false, flag4: 2 });
                } else if (res.data.cInfo[i].certifyType == '12' && res.data.cInfo[i].scanCopyPath) {
                  img5 = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath; this.setData({ [uploadImg5]: 'upload-img', [photoTxt5]: false, flag5: 2 });
                } else if (res.data.cInfo[i].certifyType == '06' && res.data.cInfo[i].scanCopyPath) {
                  img6 = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath; this.setData({ [uploadImg6]: 'upload-img', [photoTxt6]: false, flag6: 2 });
                }
              }
              this.setData({
                mobileEmail: res.data.mInfo.merchantAccount,
                typeIndex: res.data.mInfo.custType,
                merchantsName: res.data.mInfo.custName,
                abbreviation: res.data.mInfo.shortName,
                tel: res.data.mInfo.contactPhone,
                provinceId: provinceId,
                cityId: cityId,
                areaId: areaId,
                address: res.data.mInfo.custAdd,
                code: res.data.mInfo.businessLicense,
                endDate: endDate,
                time: time,
                checked: checked,
                [photoImg]: img == '' ? 'images/add.png' : img,
                [photoImg2]: img2 == '' ? 'images/add.png' : img2,
                [photoImg3]: img3 == '' ? 'images/add.png' : img3,
                [photoImg4]: img4 == '' ? 'images/add.png' : img4,
                [photoImg5]: img5 == '' ? 'images/add.png' : img5,
                [photoImg6]: img6 == '' ? 'images/add.png' : img6
              })

              // console.log(this.data.photoArr);
              let merchantsInfoStorage2 = wx.getStorageSync('merchantsInfoStorage2');
              // let merchantsInfoStorage2 = [{ cInfo: 'res.data.cInfo' }, { mInfo: 'res.data.mInfo' }, { pInfo: [{ productId: 1, productRate: 0.1, sn: '' }, { productId: 8, productRate: 0.2, sn: '12155' }] }]
              console.log(merchantsInfoStorage2);
              if (merchantsInfoStorage2) {
                this.setData({ tempArr: merchantsInfoStorage2[2].pInfo });
                this.setData({ arrObj: merchantsInfoStorage2 })
                let productId1 = 'productArr[0].productId', productRate1 = 'productArr[0].productRate', sn1 = 'productArr[0].sn', checked1 = 'productArr[0].checked';
                let productId2 = 'productArr[1].productId', productRate2 = 'productArr[1].productRate', sn2 = 'productArr[1].sn', checked2 = 'productArr[1].checked';
                let productId3 = 'productArr[2].productId', productRate3 = 'productArr[2].productRate', sn3 = 'productArr[2].sn', checked3 = 'productArr[2].checked';
                let val = 'productObj[0].val';
                let val2 = 'productObj[1].val';
                let val3 = 'productObj[2].val';
                for (let i = 0; i < merchantsInfoStorage2[2].pInfo.length; i++) {
                  if (merchantsInfoStorage2[2].pInfo[i].productId == 8) {
                    this.setData({
                      [productId1]: merchantsInfoStorage2[2].pInfo[i].productId,
                      [productRate1]: merchantsInfoStorage2[2].pInfo[i].productRate,
                      [sn1]: merchantsInfoStorage2[2].pInfo[i].sn,
                      [checked1]: true,
                      [val]: true
                    })
                  } else if (merchantsInfoStorage2[2].pInfo[i].productId == 1) {
                    this.setData({
                      [productId2]: merchantsInfoStorage2[2].pInfo[i].productId,
                      [productRate2]: merchantsInfoStorage2[2].pInfo[i].productRate,
                      [sn2]: merchantsInfoStorage2[2].pInfo[i].sn,
                      [checked2]: true,
                      [val2]: true
                    })
                  } else if (merchantsInfoStorage2[2].pInfo[i].productId == 2) {
                    this.setData({
                      [productId3]: merchantsInfoStorage2[2].pInfo[i].productId,
                      [productRate3]: merchantsInfoStorage2[2].pInfo[i].productRate,
                      [sn3]: merchantsInfoStorage2[2].pInfo[i].sn,
                      [checked3]: true,
                      [val3]: true
                    })
                  }
                }

                let val4 = 'productObj2[0].val';
                let val5 = 'productObj2[1].val';
                let val6 = 'productObj2[2].val';
                for (let i = 0; i < merchantsInfoStorage2[2].pInfo.length; i++) {
                  if (merchantsInfoStorage2[2].pInfo[i].productId == 8) {
                    this.setData({
                      [productId1]: merchantsInfoStorage2[2].pInfo[i].productId,
                      [productRate1]: merchantsInfoStorage2[2].pInfo[i].productRate,
                      [sn1]: merchantsInfoStorage2[2].pInfo[i].sn,
                      [checked1]: true,
                      [val4]: ''
                    })
                  } else if (merchantsInfoStorage2[2].pInfo[i].productId == 1) {
                    this.setData({
                      [productId2]: merchantsInfoStorage2[2].pInfo[i].productId,
                      [productRate2]: merchantsInfoStorage2[2].pInfo[i].productRate,
                      [sn2]: merchantsInfoStorage2[2].pInfo[i].sn,
                      [checked2]: true,
                      [val5]: ''
                    })
                  } else if (merchantsInfoStorage2[2].pInfo[i].productId == 2) {
                    this.setData({
                      [productId3]: merchantsInfoStorage2[2].pInfo[i].productId,
                      [productRate3]: merchantsInfoStorage2[2].pInfo[i].productRate,
                      [sn3]: merchantsInfoStorage2[2].pInfo[i].sn,
                      [checked3]: true,
                      [val6]: ''
                    })
                  }
                }

                let params = {
                  url: 'comm/province.do',
                  method: 'get',
                }
                util.http(params).then(res => {
                  this.setData({
                    provinceArr: res.data,
                    provinceId: provinceId
                  });
                  for (let i = 0; i < res.data.length; i++) {
                    if (provinceId == res.data[i].provinceId) {
                      this.setData({ provinceIndex: i });
                      break;
                    }
                  }
                  return provinceId;
                }).then(provinceId => {
                  params.data = { provinceId: provinceId };
                  util.http(params).then(res => {
                    this.setData({
                      cityArr: res.data,
                      cityId: cityId
                    })
                    for (let i = 0; i < res.data.length; i++) {
                      if (cityId == res.data[i].cityId) {
                        this.setData({ cityIndex: i });
                        break;
                      }
                    }
                    return cityId;
                  }).then(cityId => {
                    params.data = { cityId: cityId };
                    util.http(params).then(res => {
                      this.setData({
                        areaArr: res.data,
                        areaId: areaId
                      })
                      for (let i = 0; i < res.data.length; i++) {
                        if (areaId == res.data[i].areaId) {
                          this.setData({ areaIndex: i });
                          break;
                        }
                      }
                    })
                  })
                })
              }
            }
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: '商户信息',
    active:'active',
    productHide:'',
    infoTitle:[
      { name:'商户基本信息'},
      { name: '商户产品签约' }
    ],
    productArr:[
      { name: '蜻蜓产品', productId: 8, productRate: 0.38, sn:'', checked: false },
      { name: '扫码产品', productId: 1, productRate: 0.38, sn: '', checked: false },
      { name: 'APP产品', productId: 2, productRate: 0.38, sn: '', checked: false }
    ],
    typeIndex: 0, //选择的下拉列表下标
    region: ['选择省份', '选择城市', '选择县区'],
    defaultAddress: 'defaultAddress',
    startDate: '日期选择',
    endDate: '日期选择',
    date: 'date',
    date2: 'date',
    tempFilePaths: 'images/add.png',
    uploadImg: '',
    uploadTxt: '',
    radioVal: 0,
    checked: '',
    merchantsTypeArr: ['企业', '个体', '商店'],
    merchantsTypeObj: [
      {
        id: 0,
        name: '企业'
      },
      {
        id: 1,
        name: '个体'
      },
      {
        id: 2,
        name: '商店'
      }
    ],
    photoArr: [
      { photoTitle: '营业执照', photoImg: 'images/add.png', photoTxt: '上传营业执照', uploadImg: '' },
      { photoTitle: '门头照', photoImg: 'images/add.png', photoTxt: '上传门头照', uploadImg: '' },
      { photoTitle: '店内照', photoImg: 'images/add.png', photoTxt: '上传店内照', uploadImg: '' },
      { photoTitle: '特殊行业资质照', photoImg: 'images/add.png', photoTxt: '上传特殊行业资质照', uploadImg: '' },
      { photoTitle: '电子签名照', photoImg: 'images/add.png', photoTxt: '上传电子签名照', uploadImg: '' },
      { photoTitle: '其它资料照', photoImg: 'images/add.png', photoTxt: '上传其它资料照', uploadImg: '' }
    ],
    rate: '',
    rate2: '',
    rate3: '',
    idx: 0,
    popErrorMsg: '',
    rate: '0.38',
    rate2: '0.38',
    rate3: '0.38',
    aisle: '',
    productObj: [
      { val: '' }, { val: '' }, { val: '' }//样式的显示与隐藏
    ],
    productObj2: [
      { val: true }, { val: true }, { val: true }//样式的显示与隐藏
    ],
    tempArr:[1,2,3],
    provinceArr: [],
    provinceIndex: 0,
    cityArr: [],
    cityIndex: 0,
    areaArr: [],
    areaIndex: 0,
    provinceId: '',
    cityId: '',
    areaId: ''
  },

  attached() {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navBack() {
      wx.navigateBack({ delta: 1 })
    },
    onTitle(e) {
      let index = e.currentTarget.dataset.index;
      this.setData({
        idx: index
      });
    },
    checkboxChange: function (e) {//签约产品
      this.setData({ 
        tempArr: e.detail.value,
      });
      let tempArr = this.data.tempArr;
      let checked = 'productArr[0].checked';
      let checked2 = 'productArr[1].checked';
      let checked3 = 'productArr[2].checked';
      this.setData({ [checked]: false, [checked2]: false, [checked3]: false })
      for (let i = 0; i < tempArr.length; i++) {
        if (tempArr[i] == 8){
          this.setData({ 
            [checked] : true
          })
        }else if (tempArr[i] == 1) {
          this.setData({ [checked2]: true })
        }else if (tempArr[i] == 2) {
          this.setData({ [checked3]: true })
        }
      }
    },
    productRate(e){
      let index = e.currentTarget.dataset.index;
      let productRate = 'productArr[0].productRate';
      let productRate2 = 'productArr[1].productRate';
      let productRate3 = 'productArr[2].productRate';
      // console.log(e)
      if (index == 0){
        if (e.detail.value >= 0.25 && e.detail.value <= 1) {
          this.setData({[productRate]: e.detail.value})
        } else {
          wx.showToast({
            title: "请输入0.25-1之间的结算费率！",
            icon: 'none',
            duration: 3000
          })
          return;
        }
      } else if (index == 1) {
        if (e.detail.value >= 0.25 && e.detail.value <= 1) {
          this.setData({ [productRate2]: e.detail.value })
        } else {
          wx.showToast({
            title: "请输入0.25-1之间的结算费率！",
            icon: 'none',
            duration: 3000
          })
          return;
        }
      } else if (index == 2) {
        if (e.detail.value >= 0.25 && e.detail.value <= 1) {
          this.setData({ [productRate3]: e.detail.value })
        } else {
          wx.showToast({
            title: "请输入0.25-1之间的结算费率！",
            icon: 'none',
            duration: 3000
          })
          return;
        }
      }
    },
    snInput(e){
      let sn = 'productArr[0].sn';
      this.setData({[sn]:e.detail.value})
    },
    submitFun() {
      let productArr = this.data.productArr;
      let newArr = [],msg = '',flag = true; 
      for (let i = 0; i < productArr.length; i++) {
        if (productArr[i].checked) {
          if (!productArr[i].productRate || productArr[i].productRate < 0.25 || productArr[i].productRate > 1) {
            flag = false;
            if (productArr[i].productId == 8){
              msg = "请正确输入蜻蜓产品的结算费率!";
            } else if (productArr[i].productId == 1){
              msg = "请正确输入扫码产品的结算费率!";
            } else if (productArr[i].productId == 2) {
              msg = "请正确输入APP产品的结算费率!";
            }
            // this.setData({ popErrorMsg: msg });
            // this.ohShitfadeOut();
              break;
          }
          newArr.push({ productId: productArr[i].productId, productRate: productArr[i].productRate, sn: productArr[i].sn })
        } 
      }
      // console.log(newArr);
      if (!flag){
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 3000
        })
        return;
      }
      let pInfo = "arrObj[2].pInfo";
      let merchantsInfoStorage2 = wx.getStorageSync('merchantsInfoStorage2');
      wx.setStorageSync('merchantsInfoStorage2', Object.assign({custId:merchantsInfoStorage2[1].mInfo.custId},{ 
         productInfos: JSON.stringify(newArr)
      }));
      // console.log(wx.getStorageSync('merchantsInfoStorage2')); return;
      // this.setData({ [pInfo]: newArr }); 
      // console.log(this.data.arrObj);return;
      // wx.setStorageSync('certificateStorage', {
      //   productInfos: JSON.stringify(newArr)
      // });
      // app.globalData.showTips2 = true;
      // wx.switchTab({
      //   url: '/pages/homePage/homePage',
      // })
      this.triggerEvent('alertEvent', true)
    },
    back() {
      wx.navigateBack({ delta: 1 });
    },
    chooseimage: function (e) {
      let index = e.currentTarget.dataset.index;
      let that = this;
      wx.showActionSheet({
        itemList: ['从相册中选择', '拍照'],
        itemColor: "#699dd7",
        success: function (res) {
          if (!res.cancel) {
            if (res.tapIndex == 0) {
              that.chooseWxImage('album', index)
            } else if (res.tapIndex == 1) {
              that.chooseWxImage('camera', index)
            }
          }
        }
      })
    },
    chooseWxImage: function (type, index) {
      let that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: [type],
        success: function (res) {
          let uploadImg = 'photoArr[' + index + '].uploadImg';
          let photoTxt = 'photoArr[' + index + '].photoTxt';
          let photoImg = 'photoArr[' + index + '].photoImg';
          that.setData({
            [uploadImg]: 'upload-img',//放大照片
            [photoTxt]: false,//隐藏照片中的文字
            [photoImg]: res.tempFilePaths[0]//上传的照片
          })
        }
      })
    },
  }
})