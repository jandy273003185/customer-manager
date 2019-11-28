// components/merchantsIntoPieces/index.js
let util = require('../../utils/utils.js');
let app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // show: {
    //   type: "String",
    //   value: '',
    //   observer: function (news, olds, path) {
    //     if (news){
    //       this.setData({ popErrorMsg: news });
    //       let fadeOutTimeout = setTimeout(() => {
    //         this.setData({ popErrorMsg: '' });
    //         clearTimeout(fadeOutTimeout);
    //       }, 3000);
    //     }
    //   }
    // },
    pageName:{
      type: "String",
      value: '',
      observer: function (news, olds, path) {
        console.log(news)
        app.globalData.pageName = news;
      }
    },
    custId:{
      type: "String",
      value: '',
      observer: function (news, olds, path) {
        if (news){
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
              // console.log(wx.getStorageSync('merchantsInfoStorage'));
              wx.removeStorageSync('merchantsInfoStorage');
              wx.setStorageSync('merchantsInfoStorage', [{ cInfo: res.data.cInfo }, { mInfo: res.data.mInfo }, { pInfo: res.data.pInfo }, { provinces: res.data.provinces }, { bankProvinces: res.data.bankProvinces }, { uri: res.data.uri }, { url: res.data.url }, { banks: res.data.banks }]);
              this.setData({ arrObj: [{ cInfo: res.data.cInfo }, { mInfo: res.data.mInfo }, { pInfo: res.data.pInfo }, { provinces: res.data.provinces }, { bankProvinces: res.data.bankProvinces }, { uri: res.data.uri }, { url: res.data.url },{ banks: res.data.banks }]})

              let provinceId = '', cityId = '', areaId = '';
              if (res.data.provinces[0]){
                provinceId = res.data.provinces[0].provinceId;
                cityId = res.data.provinces[0].cityId;
                areaId = res.data.provinces[0].areaId;
              }
              
              let endDate = null, time = null, checked = '';
              if (res.data.mInfo.businessTermEnd == '长期'){
                endDate = '日期选择';
                checked = true;
                time = res.data.mInfo.businessTermEnd;
                this.setData({radioVal: 1});
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
              for (let i = 0; i < res.data.cInfo.length; i++){
                if (res.data.cInfo[i].certifyType == '02' && res.data.cInfo[i].scanCopyPath){
                  img = res.data.uri + res.data.url + res.data.cInfo[i].scanCopyPath;
                  this.setData({ [uploadImg]: 'upload-img', [photoTxt]: false, flag1: 2 });
                } else if (res.data.cInfo[i].certifyType == '08' && res.data.cInfo[i].scanCopyPath){
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
                businessTermEnd: time,
                checked: checked,
                [photoImg]: img == '' ?'images/add.png':img,
                [photoImg2]: img2 == '' ? 'images/add.png' : img2,
                [photoImg3]: img3 == '' ? 'images/add.png' : img3,
                imgObj: { businessLicenseInOne: img, shopFrontDoor: img2, shopInterior: img3, specialBusiness: img4, electronicSignaturePhoto: img5, otherPhoto1: img6,  },
                [photoImg4]: img4 == '' ? 'images/add.png' : img4,
                [photoImg5]: img5 == '' ? 'images/add.png' : img5,
                [photoImg6]: img6 == '' ? 'images/add.png' : img6
              })
              // console.log(this.data.provinceId)
              // console.log(this.data.photoArr);
              let params = {
                url: 'comm/province.do',
                method: 'get',
              }
              util.http(params).then(res => {
                this.setData({
                  provinceArr: res.data,
                  provinceId: provinceId
                });
                for (let i = 0; i < res.data.length; i++){
                  if (provinceId == res.data[i].provinceId) {
                    this.setData({provinceIndex: i});
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
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    title:'商户进件',
    typeIndex: 0, //选择的下拉列表下标
    typeHide:'typeHide',
    region: ['选择省份', '选择城市', '选择县区'],
    defaultAddress: 'defaultAddress',
    addressTemp: '',
    startDate: '日期选择',
    endDate: '日期选择',
    date: 'date',
    date2: 'date',
    tempFilePaths: 'images/add.png',
    uploadImg:'',
    uploadTxt:'',
    radioVal: 0,
    checked:'',
    merchantsTypeArr: ['个人', '企业', '个体户'],
    // merchantsTypeObj: [0 个人1 企业 2 个体户
    //   {id: 0,name: '企业'},
    //   {id: 1,name: '个体'},
    //   {id: 2,name: '商店'}
    // ],
    photoArr: [
      { photoTitle: '营业执照', photoImg: 'images/add.png', photoTxt: '上传营业执照', uploadImg: '' },
      { photoTitle: '门头照', photoImg: 'images/add.png', photoTxt: '上传门头照', uploadImg: '' },
      { photoTitle: '店内照', photoImg: 'images/add.png', photoTxt: '上传店内照', uploadImg: '' },
      { photoTitle: '特殊行业资质照', photoImg: 'images/add.png', photoTxt: '上传特殊行业资质照', uploadImg: '' },
      { photoTitle: '电子签名照', photoImg: 'images/add.png', photoTxt: '上传电子签名照', uploadImg: '' },
      { photoTitle: '其它资料照', photoImg: 'images/add.png', photoTxt: '上传其它资料照', uploadImg: '' }
    ],
    mobileEmail: '',
    merchantsType: '',
    merchantsName: '',
    abbreviation: '',
    tel: '',
    address: '',//详细地址
    code: '',
    time: '',
    img: '',//营业执照
    img2: '',//门头照
    img3: '',//店内照
    img4: '',//特殊行业资质照
    img5: '',//电子签名照
    img6: '',//其它资料照
    arrObj: [],
    imgObj:{},
    custId:'',
    provinceArr: [],
    provinceIndex:0,
    cityArr: [],
    cityIndex: 0,
    areaArr: [],
    areaIndex: 0,
    provinceId: '',
    cityId: '',
    areaId: '',
    flag1:'',
    flag2: '',
    flag3: '',
    flag4: '',
    flag5: '',
    flag6: '',
  },
  
  attached(){
    let params = {
      url: 'comm/province.do',
      method: 'get',
    }
    util.http(params).then(res => {
      this.setData({
        provinceArr:res.data,
        provinceId: res.data[0].provinceId
      });console.log(this.data.provinceId)
      return res.data[0].provinceId;
    }).then(provinceId => {
      params.data = { provinceId: provinceId };
      util.http(params).then(res => {
        this.setData({
          cityArr: res.data,
          cityId: res.data[0].cityId
        })
        return res.data[0].cityId;
      }).then(cityId => {
        params.data = { cityId: cityId };
        util.http(params).then(res => {
          this.setData({ 
            areaArr: res.data, 
            areaId: res.data[0].areaId
          })
        })
      })
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navBack(){
      wx.navigateBack({ delta: 1 })
    },
    cancelDate(e) {
      console.log(e)
      // this.setData({ dateHide: false })
    },
    bindPickerChange: function (e) {//商户类型
      // console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        typeIndex: e.detail.value
      })
    },
    provinceChange: function(e) {//省选择
      let provinceId = this.data.provinceArr[e.detail.value].provinceId;//e.currentTarget.dataset.provinceid;
      this.setData({
        provinceIndex: e.detail.value
      })
      let params = {
        url: 'comm/province.do',
        data: { provinceId: provinceId},
        method: 'get',
      }
      util.http(params).then(res => {
        this.setData({
          cityIndex:0,
          cityArr: res.data,
          cityId: res.data[0].cityId
        });
        return res.data[0].cityId;
      }).then(cityId=>{
        params.data = { cityId: cityId};
        util.http(params).then(res => {
          this.setData({
            areaIndex: 0,
            areaArr: res.data,
            areaId: res.data[0].areaId
          })
        })
      })
      this.setData({ provinceId});
    },
    cityChange: function (e) {//市选择
      let cityId = this.data.cityArr[e.detail.value].cityId;
      this.setData({
        cityIndex: e.detail.value
      })
      let params = {
        url: 'comm/province.do',
        data: { cityId: cityId },
        method: 'get',
      }
      util.http(params).then(res => {
        this.setData({
          areaArr: res.data,
          areaIndex: 0,
          areaId:res.data[0].areaId
        })
      })
      this.setData({ cityId });
    },
    areaChange: function (e) {//区选择
      this.setData({
        areaIndex: e.detail.value
      })
      let areaId = this.data.areaArr[e.detail.value].areaId;
      this.setData({ areaId });
    },
    // bindDateChange(e) {
    //   this.setData({
    //     startDate: e.detail.value,
    //     date: ''
    //   })
    // },
    bindDateChange2(e) {//日期选择
      this.setData({
        endDate: e.detail.value,
        time: e.detail.value,
        date2: '',
        checked: ''
      })
    },
    onRadio(e) {//长期
      if (this.data.radioVal == 0){
        this.setData({
          endDate: '日期选择',
          date2: 'date',
          time: '长期',
          radioVal: 1,
          checked: true
        });
      }else{
        this.setData({
          radioVal: 0,
          time: '',
          checked: ''
        });
      }
      // this.setData({
      //   checked: this.data.checked?true:'',
      //   radioVal: this.data.radioVal?1:0
      // });
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
          // console.log(res)
          let uploadImg = 'photoArr[' + index + '].uploadImg';
          let photoTxt = 'photoArr[' + index + '].photoTxt';
          let photoImg = 'photoArr[' + index + '].photoImg';
          that.setData({
            [uploadImg]: 'upload-img',//放大照片
            [photoTxt]: false,//隐藏照片中的文字
            [photoImg]: res.tempFilePaths[0]//上传的照片
          })
          let params = {
            url:'common/upload.do',
            tempFilePaths: res.tempFilePaths[0]
          };
          util.imgUpload(params).then((result)=>{
            let res = JSON.parse(result);
            console.log(res)
            let imgUrl = res.data.imagePath;//res.data.uri + res.data.url;
            // console.log(index,imgUrl);
            if(index == 0){
              that.setData({ imgObj: Object.assign(that.data.imgObj,{ businessLicenseInOne: imgUrl }) })
            }else if(index == 1){
              that.setData({ imgObj: Object.assign(that.data.imgObj, { shopFrontDoor: imgUrl }) })
            } else if (index == 2) {
              that.setData({ imgObj: Object.assign(that.data.imgObj, { shopInterior: imgUrl }) })
            } else if (index == 3) {
              that.setData({ imgObj: Object.assign(that.data.imgObj, { specialBusiness: imgUrl }) })
            } else if (index == 4) {
              that.setData({ imgObj: Object.assign(that.data.imgObj, { electronicSignaturePhoto: imgUrl }) })
            } else if (index == 5) {
              that.setData({ imgObj: Object.assign(that.data.imgObj, { otherPhoto1: imgUrl }) })
            }
            
            // console.log(that.data.imgObj)
          });
        }
      })
    },  
    nextFun() {//console.log(this.data.provinceId,this.data.cityId,this.data.areaId)
      // let val = util.mobileEmail(this.data.mobileEmail);
      let val = util.mobile(this.data.mobileEmail);console.log(val)
      if (!val) {
        // this.setData({ popErrorMsg: "" });
        // this.ohShitfadeOut();
        wx.showToast({
          // title: "手机号或邮箱有误！",
          title: "请正确输入手机号！",
          icon: 'none',
          duration: 3000
        })
        return;
      };
      if (!this.data.merchantsName || this.data.merchantsName.length>50) {
        wx.showToast({
          title: "请正确输入商户名称！",
          icon: 'none',
          duration: 3000
        })
        return;
      } 
      if (!this.data.abbreviation || this.data.abbreviation.length > 50) {
        wx.showToast({
          title: "请正确输入商户简称！",
          icon: 'none',
          duration: 3000
        })
        return;
      } 
      let val2 = util.tel(this.data.tel);
      if (!val2) {
        wx.showToast({
          title: "请正确输入客服号码！",
          icon: 'none',
          duration: 3000
        })
        return;
      }
      if (this.data.address.length > 100) {
        wx.showToast({
          title: "请正确输入详细地址！",
          icon: 'none',
          duration: 3000
        })
        return;
      } 
      if (!this.data.code && this.data.typeIndex !=0) {
        wx.showToast({
          title: "请正确输入营业执照编号！",
          icon: 'none',
          duration: 3000
        })
        return;
      } 
      if (!this.data.time && this.data.typeIndex != 0) {
        wx.showToast({
          title: "请选择营业执照日期！",
          icon: 'none',
          duration: 3000
        })
        return;
      }
      console.log(this.data.imgObj)
      if (!this.data.imgObj.shopInterior){
        wx.showToast({
          title: "请上传店内照！",
          icon: 'none',
          duration: 3000
        })
        return;
      }

      wx.setStorageSync('basicImgStorage', [
        // custScanCopys2: JSON.stringify([
        { certifyType: '02', scanCopyPath: this.data.imgObj.businessLicenseInOne == (undefined || 'images/add.png') ? '' : this.data.imgObj.businessLicenseInOne, certifyNo: this.data.code, flag: this.data.imgObj.businessLicenseInOne == (undefined || 'images/add.png') ? 0 : (this.data.flag1 == 2 ? 2 : 1)},
        { certifyType: '08', scanCopyPath: this.data.imgObj.shopFrontDoor == (undefined || 'images/add.png') ? '' : this.data.imgObj.shopFrontDoor, certifyNo: '', flag: this.data.imgObj.shopFrontDoor == (undefined || 'images/add.png') ? 0 : (this.data.flag2==2?2:1)},
        { certifyType: '18', scanCopyPath: this.data.imgObj.shopInterior == (undefined || 'images/add.png') ? '' : this.data.imgObj.shopInterior, certifyNo: '', flag: this.data.imgObj.shopInterior == (undefined || 'images/add.png') ? 0 : (this.data.flag3 == 2 ? 2 : 1)},
        { certifyType: '11', scanCopyPath: this.data.imgObj.specialBusiness == (undefined || 'images/add.png') ? '' : this.data.imgObj.specialBusiness, certifyNo: '', flag: this.data.imgObj.specialBusiness == (undefined || 'images/add.png') ? 0 : (this.data.flag4 == 2 ? 2 : 1) },
        { certifyType: '12', scanCopyPath: this.data.imgObj.electronicSignaturePhoto == (undefined || 'images/add.png') ? '' : this.data.imgObj.electronicSignaturePhoto, certifyNo: '', flag: this.data.imgObj.electronicSignaturePhoto == (undefined || 'images/add.png') ? 0 : (this.data.flag5 == 2 ? 2 : 1)},
        { certifyType: '06', scanCopyPath: this.data.imgObj.otherPhoto1 == (undefined || 'images/add.png') ? '' : this.data.imgObj.otherPhoto1, certifyNo: '', flag: this.data.imgObj.otherPhoto1 == (undefined || 'images/add.png') ? 0 : (this.data.flag6 == 2 ? 2 : 1)}
        ]
        // ])
      );
  
      wx.setStorageSync('basicStorage', {
        merchantAccount: this.data.mobileEmail,
        // merchantAccount: wx.getStorageSync('basicStorage').merchantAccount == undefined ? this.data.mobileEmail : wx.getStorageSync('basicStorage').merchantAccount,
        custType: this.data.typeIndex ,
        custId: this.data.custId,
        custName: this.data.merchantsName ,
        shortName: this.data.abbreviation ,
        contactPhone: this.data.tel ,
        province: this.data.provinceId,//this.data.region[0] == '选择省份' ? '' : this.data.region[0],
        city: this.data.cityId,//this.data.region[1] == '选择城市' ? '' : this.data.region[1],
        country: this.data.areaId,//this.data.region[2] == '选择县区' ? '' : this.data.region[2],
        custAdd: this.data.address ,
        businessLicense: this.data.code ,
        businessTermEnd: this.data.time 
      });
      wx.navigateTo({ url: '/pages/legalPerson/legalPerson' });
    },
    mobileEmail(e) {//验证手机号或邮箱
      let val = util.mobile(e.detail.value);
      if (!val){
        wx.showToast({
          title: "请正确输入手机号！",
          icon: 'none',
          duration: 3000
        })
        return;
      }else{
        this.setData({ mobileEmail: e.detail.value});
      }
    },
    merchantsName(e) { this.setData({ merchantsName: e.detail.value })},
    abbreviation(e) { this.setData({ abbreviation: e.detail.value }); },
    address(e) { this.setData({ address: e.detail.value });},
    code(e) { this.setData({ code: e.detail.value }); },
    tel(e) {//验证客服号码
      let val = util.tel(e.detail.value);
      if (!val) {
        wx.showToast({
          title: "请正确输入客服号码！",
          icon: 'none',
          duration: 3000
        })
        return;
      } else {
        this.setData({ tel: e.detail.value });
      }
    },
    // notNull(e){//验证不为空
    //   if(!e.detail.value){
    //     wx.showToast({
    //       title: "客服号码有误！",
    //       icon: 'none',
    //       duration: 3000
    //     })
    //   }
    //   return;
    // },
    // ohShitfadeOut() {
    //   let fadeOutTimeout = setTimeout(() => {
    //     this.setData({ popErrorMsg: '' });
    //     clearTimeout(fadeOutTimeout);
    //   }, 3000);
    // },
  }
})