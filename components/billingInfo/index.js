// components/homePage/index.js
let util = require('../../utils/utils.js');
let bank = require('../../utils/bankInfo.js');
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
    index: 0, //选择的下拉列表下标
    region: ['选择省份', '选择城市', '选择县区'],
    defaultAddress: 'defaultAddress',
    billingTypeArr: ['对公', '对私'],
    billingTypeObj: [
      {id: '01',name: '对公'},
      {id: '02',name: '对私'}
    ],
    photoType: '开户许可证',
    tempFilePaths: 'images/add.png',
    uploadImg: '',
    uploadTxt: true,
    bankNo: '',
    // bankName: '',
    provinceArr: [],
    provinceIndex: 0,
    cityArr: [],
    cityIndex: 0,
    bankProvinceId: '',
    bankCityId: '',
    bankArr: [],//
    bankIndex: 0,
    bankSubArr: [],
    bankSubIndex: 0,
    bankCode: '',
    branchBankCode: '',//
    // bankNameSub: '',
    accountName: '',
    billingType: '',
    photo: '',
    arrObj: [],
    flag1: '',
    flag2: '',
    photoTxtHide: '',
    delImgHide: 'delImgHide',
  },

  attached() {
    let merchantsInfoStorage = wx.getStorageSync('merchantsInfoStorage');
    if (merchantsInfoStorage) {
      console.log(merchantsInfoStorage)
      this.setData({ arrObj: merchantsInfoStorage })
      let img = '';
      for (let i = 0; i < merchantsInfoStorage[0].cInfo.length; i++) {
        if (merchantsInfoStorage[0].cInfo[i].certifyType == '03' && merchantsInfoStorage[0].cInfo[i].scanCopyPath) {
          img = merchantsInfoStorage[5].uri + merchantsInfoStorage[6].url + merchantsInfoStorage[0].cInfo[i].scanCopyPath; this.setData({ uploadImg: 'upload-img', photoTxtHide: 'photoTxtHide', delImgHide: '', flag1: 2 })
        } else if (merchantsInfoStorage[0].cInfo[i].certifyType == '07' && merchantsInfoStorage[0].cInfo[i].scanCopyPath) {
          img = merchantsInfoStorage[5].uri + merchantsInfoStorage[6].url + merchantsInfoStorage[0].cInfo[i].scanCopyPath; this.setData({ uploadImg: 'upload-img', photoTxtHide: 'photoTxtHide', delImgHide: '', flag1: 2 })
        }
      }
      this.setData({
        bankNo: merchantsInfoStorage[1].mInfo.compMainAcct,
        bankName: merchantsInfoStorage[1].mInfo.compAcctBank,
        bankNameSub: merchantsInfoStorage[1].mInfo.branchBank,
        accountName: merchantsInfoStorage[1].mInfo.bankAcctName,
        bankProvinceId: merchantsInfoStorage[4].bankProvinces[0].bankProvinceId,
        bankCityId: merchantsInfoStorage[4].bankProvinces[0].bankCityId,
        index: merchantsInfoStorage[1].mInfo.compMainAcctType == '01'?0:1,
        photo: img,
        tempFilePaths: img == '' ? 'images/add.png' : img
      });
      if (this.data.index == 0) {
        this.setData({ photoType: '开户许可证' })
      } else {
        this.setData({ photoType: '银行卡正面照' })
      }

      let params = {
        url: 'comm/bankProvince.do',
        method: 'get',
      }
      util.http(params).then(res => {
        this.setData({
          provinceArr: res.data,
          bankProvinceId: merchantsInfoStorage[4].bankProvinces[0].bankProvinceId
        })
        for (let i = 0; i < res.data.length; i++) {
          if (merchantsInfoStorage[4].bankProvinces[0].bankProvinceId == res.data[i].bankProvinceId) {
            this.setData({ provinceIndex: i });
            break;
          }
        }
        return merchantsInfoStorage[4].bankProvinces[0].bankProvinceId;
      }).then(bankProvinceId => {
        params.data = { bankProvinceId: bankProvinceId };
        util.http(params).then(res => {
          this.setData({
            cityArr: res.data,
            bankCityId: merchantsInfoStorage[4].bankProvinces[0].bankCityId
          })
          for (let i = 0; i < res.data.length; i++) {
            if (merchantsInfoStorage[4].bankProvinces[0].bankCityId == res.data[i].bankCityId) {
              this.setData({ cityIndex: i });
              break;
            }
          }
        })
      });
      let params2 = {
        url: 'comm/bankHeadOffice',
        method: 'get',
      }
      if (merchantsInfoStorage[7].banks.length>0){
        util.http(params2).then(res => {
          console.log(res)
          this.setData({
            bankArr: res.data,
            bankCode: merchantsInfoStorage[7].banks[0].bankCode
          })
          for (let i = 0; i < res.data.length; i++) {
            if (merchantsInfoStorage[7].banks[0].bankCode == res.data[i].bankCode) {
              this.setData({ bankIndex: i });
              break;
            }
          }
          return merchantsInfoStorage[7].banks[0].bankCode;
        }).then(bankCode => {
          params2.url = "comm/bankBranch";
          params2.data = { bankCode: bankCode, cityCode: this.data.bankCityId };
          util.http(params2).then(res => {
            this.setData({
              bankSubArr: res.data,
              branchBankCode: merchantsInfoStorage[7].banks[0].branchBankCode
            })
            for (let i = 0; i < res.data.length; i++) {
              if (merchantsInfoStorage[7].banks[0].branchBankCode == res.data[i].branchBankCode) {
                this.setData({ bankSubIndex: i });
                break;
              }
            }
          })
        });
      }else{
        this.initBank(params2);
      }
    }else{
      let params = {
        url: 'comm/bankProvince.do',
        method: 'get',
      }
      util.http(params).then(res => {
        console.log(res)  
        this.setData({
          provinceArr: res.data,
          bankProvinceId: res.data[0].bankProvinceId
        })
        return res.data[0].bankProvinceId;
      }).then(bankProvinceId => {
        params.data = { bankProvinceId: bankProvinceId };
        util.http(params).then(res => {
          console.log(res)
          this.setData({
            cityArr: res.data,
            bankCityId: res.data[0].bankCityId
          })
        })
      }).then(bankCityId => {
        let params2 = {
          url: 'comm/bankHeadOffice',
          method: 'get',
        }
        this.initBank(params2);
      });
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navBack() {
      wx.navigateBack({ delta: 1 })
    },

    initBank(params2){//初始化银行信息
      util.http(params2).then(res => {
        console.log(res)
        this.setData({
          bankArr: res.data,
          bankCode: res.data[0].bankCode
        })
        return res.data[0].bankCode;
      }).then(bankCode => {
        params2.url = "comm/bankBranch";
        params2.data = { bankCode: bankCode, cityCode: this.data.bankCityId };
        console.log(params2)
        util.http(params2).then(res => {
          console.log(res)
          this.setData({
            bankSubArr: res.data,
            // branchBankCode: res.data[0].cityCode
          })
        })
      });
    },
    provinceChange: function (e) {//省选择
      let bankProvinceId = this.data.provinceArr[e.detail.value].bankProvinceId;//e.currentTarget.dataset.provinceid;
      this.setData({
        provinceIndex: e.detail.value
      })
      let params = {
        url: 'comm//bankProvince.do',
        data: { bankProvinceId: bankProvinceId },
        method: 'get',
      }
      util.http(params).then(res => {
        console.log(res)
        this.setData({
          cityIndex: 0,
          cityArr: res.data,
          bankCityId: res.data[0].bankCityId
        });
        let params2 = {
          url: 'comm/bankBranch',
          method: 'get',
          data: { bankCode: this.data.bankCode, cityCode: res.data[0].bankCityId}
        }
        console.log(params2)
        util.http(params2).then(res => {
          console.log(res)
          this.setData({
            bankSubArr: res.data,
            branchBankCode: res.data[0].branchBankCode
          })
        })
        return res.data[0].bankCityId;
      })
      this.setData({ bankProvinceId });
    },
    cityChange: function (e) {//市选择
      let bankCityId = this.data.cityArr[e.detail.value].bankCityId;
      this.setData({
        cityIndex: e.detail.value
      })
      this.setData({ bankCityId });
      let params2 = {
        url: 'comm/bankBranch',
        method: 'get',
        data: { bankCode: this.data.bankCode, cityCode: bankCityId}
      }
      console.log(params2)
      util.http(params2).then(res => {
        console.log(res)
        this.setData({
          bankSubArr: res.data,
          branchBankCode: res.data[0].branchBankCode
        })
      })

    },
    bankChange: function (e) {//开户银行选择
      this.setData({
        bankIndex: e.detail.value,
        bankCode: this.data.bankArr[e.detail.value].bankCode
      })
    },
    bankSubChange: function (e) {//开户支行选择
      console.log(e.detail.value); 
      console.log(this.data.bankSubArr);
      this.setData({
        bankSubIndex: e.detail.value,
        branchBankCode: this.data.bankSubArr[e.detail.value].branchBankCode
      })
    },
    bindPickerChange: function (e) {//结算类型
      this.setData({index: e.detail.value})
      if (e.detail.value == 0){
        this.setData({ photoType: '开户许可证' })
      }else{
        this.setData({ photoType: '银行卡正面照' })
      }
    },
    chooseimage: function () {
      var that = this;
      wx.showActionSheet({
        itemList: ['从相册中选择', '拍照'],
        itemColor: "#699dd7",
        success: function (res) {
          if (!res.cancel) {
            if (res.tapIndex == 0) {
              that.chooseWxImage('album')
            } else if (res.tapIndex == 1) {
              that.chooseWxImage('camera')
            }
          }
        }
      })
    },
    chooseWxImage: function (type) {
      var that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: [type],
        success: function (res) {
          //console.log(res);
          that.setData({
            tempFilePaths: res.tempFilePaths[0],
            uploadImg: 'upload-img',
            photoTxtHide: 'photoTxtHide',
            delImgHide: ''
          })
          let params = {
            url: 'common/upload.do',
            tempFilePaths: res.tempFilePaths[0]
          };
          util.imgUpload(params).then((result) => {
            let res = JSON.parse(result);
            // console.log(index+res)
            let imgUrl = res.data.imagePath;
            that.setData({ photo: imgUrl })
          })
        }
      })
    },
    nextFun() {
      if (!util.bankNo(this.data.bankNo)) {util.tips('请正确输入银行卡号！'); return;}
      // if (!this.data.bankName) {util.tips('请正确输入开户银行！'); return;}
      // if (!this.data.bankNameSub || this.data.bankNameSub.length > 50) {util.tips('请正确输入开户支行！'); return;}
      if (!this.data.accountName || this.data.accountName.length > 50) {
        util.tips('请正确输入开户人！'); return;
      }
      if (!this.data.photo) {util.tips('请上传照片！'); return;}

      let arr = [];
      if (this.data.index == 0) { 
        arr.push({ certifyType: '03', scanCopyPath: this.data.tempFilePaths == (undefined || 'images/add.png') ? '' : this.data.photo, certifyNo: this.data.iDcard, flag: this.data.tempFilePaths == (undefined || 'images/add.png') ? 0 : (this.data.flag1 == 2 ? 2 : 1)});
      } else {
        arr.push({ certifyType: '07', scanCopyPath: this.data.tempFilePaths == (undefined || 'images/add.png') ? '' : this.data.photo, certifyNo: this.data.iDcard, flag: this.data.tempFilePaths == (undefined || 'images/add.png') ? 0 : (this.data.flag1 == 2 ? 2 : 1) });
      };
      wx.setStorageSync('billingImgStorage', arr);
      wx.setStorageSync('billingStorage', {
        compMainAcct: this.data.bankNo ,
        compAcctBank: this.data.bankCode ,
        branchBank: this.data.branchBankCode ,
        bankProvinceName: this.data.bankProvinceId,
        bankCityName: this.data.bankCityId,
        bankAcctName: this.data.accountName ,
        compMainAcctType: this.data.index == 0?'01':'02'
      });
      // console.log(wx.getStorageSync('billingStorage'));
      // return;
      wx.navigateTo({ url: '/pages/certificate/certificate' });
    },
    back() {
      wx.navigateBack({ delta: 1 });
    },
    bankNo(e) {//验证银行卡号
      // let val = util.bankNo(e.detail.value);
      let val = e.detail.value;
      // if (!val || !bank.bankInfo(e.detail.value).bankName) {
      if (!util.bankNo(val)) {
        util.tips('请正确输入银行卡号！'); return;
      } else {
        for (let i = 0; i < this.data.bankArr.length; i++){
          this.setData({//由于本地bankiInfo.js中的银行卡号与数据库中的银行卡号不一致所以验证存在问题
            bankNo: e.detail.value,
            bankIndex: i,
            bankCode: this.data.bankArr[i].bankCode
          })
          if (this.data.bankArr[i].bankName == bank.bankInfo(e.detail.value).bankName){
            this.setData({
              bankNo: e.detail.value,
              bankIndex: i,
              bankCode: this.data.bankArr[i].bankCode
            })
            break;
          }
        }
      }
    },
    accountName(e) {//验证开户人
      let val = util.nameVerifycation(e.detail.value);
      if (!val) {
        util.tips('请正确输入开户人！'); return;
      } else {
        this.setData({ accountName: e.detail.value });
      }
    },
    delImg(e) {
      this.setData({
        uploadImg: '',
        photoTxtHide: '',
        photo: '',
        delImgHide: 'delImgHide',
        tempFilePaths: 'images/add.png'
      });
    },
  }
})