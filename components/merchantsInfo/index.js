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
          console.log(params)
          util.http(params).then(res => {
            console.log(res)
            if (res.code == 200) {
              // console.log(wx.getStorageSync('merchantsInfoStorage2'));
              // wx.removeStorageSync('merchantsInfoStorage2');
              wx.setStorageSync('merchantsInfoStorage2', [{ cInfo: res.data.cInfo }, { mInfo: res.data.mInfo }, { pInfo: res.data.pInfo }, { provinces: res.data.provinces }, { bankProvinces: res.data.bankProvinces }, { uri: res.data.uri }, { url: res.data.url }, { banks: res.data.banks }]);
              // this.setData({ arrObj: [{ cInfo: res.data.cInfo }, { mInfo: res.data.mInfo }, { pInfo: res.data.pInfo }, { provinces: res.data.provinces }, { bankProvinces: res.data.bankProvinces }, { uri: res.data.uri }, { url: res.data.url }, { banks: res.data.banks }] })


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
              let photoImg = 'photoArr[0].photoImg', uploadImg = 'photoArr[0].uploadImg', photoTxtHide = 'photoArr[0].photoTxtHide', delImgHide = 'photoArr[0].delImgHide';
              let photoImg2 = 'photoArr[1].photoImg', uploadImg2 = 'photoArr[1].uploadImg', photoTxtHide2 = 'photoArr[1].photoTxtHide', delImgHide2 = 'photoArr[1].delImgHide';
              let photoImg3 = 'photoArr[2].photoImg', uploadImg3 = 'photoArr[2].uploadImg', photoTxtHide3 = 'photoArr[2].photoTxtHide', delImgHide3 = 'photoArr[2].delImgHide';
              let photoImg4 = 'photoArr[3].photoImg', uploadImg4 = 'photoArr[3].uploadImg', photoTxtHide4 = 'photoArr[3].photoTxtHide', delImgHide4 = 'photoArr[3].delImgHide';
              let photoImg5 = 'photoArr[4].photoImg', uploadImg5 = 'photoArr[4].uploadImg', photoTxtHide5 = 'photoArr[4].photoTxtHide', delImgHide5 = 'photoArr[4].delImgHide';
              let photoImg6 = 'photoArr[5].photoImg', uploadImg6 = 'photoArr[5].uploadImg', photoTxtHide6 = 'photoArr[5].photoTxtHide', delImgHide6 = 'photoArr[5].delImgHide';
              let img = '', img2 = '', img3 = '', img4 = '', img5 = '', img6 = '';
              for (let i = 0; i < res.data.cInfo.length; i++) {
                if (res.data.cInfo[i].certifyType == '02' && res.data.cInfo[i].scanCopyPath) {
                  img = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath;
                  this.setData({ [uploadImg]: 'upload-img', [photoTxtHide]: 'photoTxtHide', [delImgHide]: '', flag1: 2 });
                } else if (res.data.cInfo[i].certifyType == '08' && res.data.cInfo[i].scanCopyPath) {
                  img2 = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath; this.setData({ [uploadImg2]: 'upload-img', [photoTxtHide2]: 'photoTxtHide', [delImgHide2]: '', flag2: 2 });
                } else if (res.data.cInfo[i].certifyType == '18' && res.data.cInfo[i].scanCopyPath) {
                  img3 = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath; this.setData({ [uploadImg3]: 'upload-img', [photoTxtHide3]: 'photoTxtHide', [delImgHide3]: '', flag3: 2 });
                } else if (res.data.cInfo[i].certifyType == '11' && res.data.cInfo[i].scanCopyPath) {
                  img4 = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath; this.setData({ [uploadImg4]: 'upload-img', [photoTxtHide4]: 'photoTxtHide', [delImgHide4]: '', flag4: 2 });
                } else if (res.data.cInfo[i].certifyType == '12' && res.data.cInfo[i].scanCopyPath) {
                  img5 = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath; this.setData({ [uploadImg5]: 'upload-img', [photoTxtHide5]: 'photoTxtHide', [delImgHide5]: '', flag5: 2 });
                } else if (res.data.cInfo[i].certifyType == '06' && res.data.cInfo[i].scanCopyPath) {
                  img6 = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath; this.setData({ [uploadImg6]: 'upload-img', [photoTxtHide6]: 'photoTxtHide', [delImgHide6]: '', flag6: 2 });
                }
              }
              let custType = res.data.mInfo.custType;
              if (custType == 1) {
                custType = 2;
              } else if (custType == 2) {
                custType = 1;
              } else {
                custType = 0;
              };//console.log(custType)
              this.setData({
                mobileEmail: res.data.mInfo.merchantAccount,
                typeIndex: custType,
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
              let params = {
                url: 'comm/selectProductInfo.do',
                method: 'get',
              }
              util.http(params).then(res => {
                console.log(res)
                this.setData({
                  productArr2: res.data,
                })
              }).then(() => {
                let merchantsInfoStorage2 = wx.getStorageSync('merchantsInfoStorage2');
                // let merchantsInfoStorage2 = [{ cInfo: 'res.data.cInfo' }, { mInfo: 'res.data.mInfo' }, { pInfo: [{ productName: '刷脸刷卡支付', productId: 5, productRate: 0.5, sn: 123, checked: true }, { productName: '公众号支付', productId: 3, productRate: 0.3, checked: true }] }]
                console.log(merchantsInfoStorage2)
                if (merchantsInfoStorage2) {
                  this.setData({ productArr: merchantsInfoStorage2[2].pInfo });
                  this.setData({ tempArr: merchantsInfoStorage2[2].pInfo });
                  this.setData({ arrObj: merchantsInfoStorage2 })
                  const productArr = this.data.productArr;
                  for (let i = 0; i < merchantsInfoStorage2[2].pInfo.length; i++) {
                    for (let j = 0; j < productArr.length; j++) {
                      if (merchantsInfoStorage2[2].pInfo[i].productId == productArr[j].productId) {
                        let checked = `productArr[${j}].checked`;
                        const productRate = `productArr[${j}].productRate`;
                        const sn = `productArr[${j}].sn`;
                        this.setData({
                          [productRate]: merchantsInfoStorage2[2].pInfo[i].productRate,
                          [checked]: true,
                          [sn]: merchantsInfoStorage2[2].pInfo[i].sn
                        })
                        if (productArr[j].productId == 8) {
                          this.setData({
                            snDisplay: ''
                          });
                        }
                        let productArr2 = this.data.productArr2;
                        for (let k = 0; k < productArr2.length; k++) {
                          if (productArr2[k].productId == merchantsInfoStorage2[2].pInfo[i].productId) {
                            productArr2.splice(k, 1);
                          }
                        }
                        this.setData({ productArr2 })
                      }
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
              })
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
      // { name: '蜻蜓产品', productId: 8, productRate: 0.38, sn:'', checked: false },
      // { name: '扫码产品', productId: 1, productRate: 0.38, sn: '', checked: false },
      // { name: 'APP产品', productId: 2, productRate: 0.38, sn: '', checked: false }
    ],
    productArr2:[],
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
    merchantsTypeArr: ['小微企业', '个体户', '企业'],
    photoArr: [
      { photoTitle: '营业执照', photoImg: 'images/add.png', photoTxt: '上传营业执照', uploadImg: '', photoTxtHide: '', delImgHide: 'delImgHide' },
      { photoTitle: '门头照', photoImg: 'images/add.png', photoTxt: '上传门头照', uploadImg: '', photoTxtHide: '', delImgHide: 'delImgHide' },
      { photoTitle: '店内照', photoImg: 'images/add.png', photoTxt: '上传店内照', uploadImg: '', photoTxtHide: '', delImgHide: 'delImgHide' },
      { photoTitle: '特殊行业资质照', photoImg: 'images/add.png', photoTxt: '上传特殊行业资质照', uploadImg: '', photoTxtHide: '', delImgHide: 'delImgHide' },
      { photoTitle: '电子签名照', photoImg: 'images/add.png', photoTxt: '上传电子签名照', uploadImg: '', photoTxtHide: '', delImgHide: 'delImgHide' },
      { photoTitle: '其它资料照', photoImg: 'images/add.png', photoTxt: '上传其它资料照', uploadImg: '', photoTxtHide: '', delImgHide: 'delImgHide' }
    ],
    idx: 0,
    popErrorMsg: '',
    aisle: '',
    tempArr:[],
    provinceArr: [],
    provinceIndex: 0,
    cityArr: [],
    cityIndex: 0,
    areaArr: [],
    areaIndex: 0,
    provinceId: '',
    cityId: '',
    areaId: '',
    snDisplay: 'snDisplay',
    snDisplay2: 'snDisplay'
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
      const arr = e.detail.value;
      for (let i = 0; i < this.data.productArr2.length; i++) {
        // const checked = `productArr2[${i}].checked`;
        // this.setData({ [checked]: false, snDisplay2: 'snDisplay' });
        this.data.productArr2[i].checked = false;
        this.data.snDisplay2 = 'snDisplay';
      }
      
      for (let item of arr) {
        // const productId = `productArr2[${item}].productId`;
        const checked2 = `productArr2[${item}].checked`;
        const productRate = `productArr2[${item}].productRate`;
        const sn = `productArr2[${item}].sn`;
        let productIdVal = this.data.productArr2[item].productId;
        let productRateVal = this.data.productArr2[item].productRate;
        let snVal = this.data.productArr2[item].sn;
        this.setData({
          [checked2]: true,
          [productRate]: productRateVal || 0.38,
          [sn]: snVal || ''
        });
        if (productIdVal == 8) {
          this.setData({
            snDisplay2: ''
          });
        }
      }
      // console.log(this.data.productArr2)
    },
    productRate(e) {
      // console.log(e.currentTarget.dataset.index)
      const rateIndex = e.currentTarget.dataset.index;
      const productRate = `productArr2[${rateIndex}].productRate`
      this.setData({ [productRate]: e.detail.value }); //console.log(this.data.productArr2)
      if (e.detail.value < 0.25 || e.detail.value > 1) {
        util.tips('请输入0.25-1之间的结算费率!');
        return;
      }
    },
    snInput(e) {
      const snIndex = e.currentTarget.dataset.index;
      const sn = `productArr2[${snIndex}].sn`
      this.setData({ [sn]: e.detail.value });
    },
    submitFun() {
      let productArr2 = this.data.productArr2;
      let newArr = [], msg = '', flag = true, checkedNum = 0; //console.log(productArr2)
      for (let i = 0; i < productArr2.length; i++) {
        if (productArr2[i].checked) {
          ++checkedNum;
          if (!productArr2[i].productRate || productArr2[i].productRate < 0.25 || productArr2[i].productRate > 1) {
            flag = false;
            msg = `请输入${productArr2[i].productName}0.25-1之间的结算费率!`;
            break;
          } else {
            newArr.push(productArr2[i]);
          }
        }
      }
      let arr = newArr.concat(this.data.productArr);
      // console.log(arr);return;
      if (!flag){
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 3000
        })
        return;
      }
      // let pInfo = "arrObj[2].pInfo";
      let merchantsInfoStorage2 = wx.getStorageSync('merchantsInfoStorage2');
      wx.setStorageSync('merchantsInfoStorage2', Object.assign({custId:merchantsInfoStorage2[1].mInfo.custId},{ 
         productInfos: JSON.stringify(arr)
      }));
      this.triggerEvent('alertEvent', true)
    },
    back() {
      wx.navigateBack({ delta: 1 });
    },
    // chooseimage: function (e) {
    //   let index = e.currentTarget.dataset.index;
    //   let that = this;
    //   wx.showActionSheet({
    //     itemList: ['从相册中选择', '拍照'],
    //     itemColor: "#699dd7",
    //     success: function (res) {
    //       if (!res.cancel) {
    //         if (res.tapIndex == 0) {
    //           that.chooseWxImage('album', index)
    //         } else if (res.tapIndex == 1) {
    //           that.chooseWxImage('camera', index)
    //         }
    //       }
    //     }
    //   })
    // },
    // chooseWxImage: function (type, index) {
    //   let that = this;
    //   wx.chooseImage({
    //     sizeType: ['original', 'compressed'],
    //     sourceType: [type],
    //     success: function (res) {
    //       let uploadImg = 'photoArr[' + index + '].uploadImg';
    //       let photoTxtHide = 'photoArr[' + index + '].photoTxtHide';
    //       let photoImg = 'photoArr[' + index + '].photoImg';
    //       let delImgHide = 'photoArr[' + index + '].delImgHide';
    //       that.setData({
    //         [uploadImg]: 'upload-img',//放大照片
    //         [photoTxtHide]: 'photoTxtHide',//隐藏照片中的文字
    //         [delImgHide]: '',//显示删除按钮
    //         [photoImg]: res.tempFilePaths[0]//上传的照片
    //       })
    //     }
    //   })
    // },
  }
})