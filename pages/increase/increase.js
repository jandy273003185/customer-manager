import validate from '../../utils/WxValidate.js';
import { http, imgUpload, getBase64Image, tips, bankNo, nameVerifycation } from '../../utils/utils.js';
import bank from '../../utils/bankInfo.js';//6216608888888888888
Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: '新增',
    commerceType: ['战略服务商', '地推团队'],
    merchantsTypeArr: ['小微企业', '个体户', '企业'],
    typeIndex: 0,
    typeHide: 'typeHide',
        // merchantsTypeObj: [0 个人1 企业 2 个体户
    commerceTypeIndex: 0,
    representativeCertNo: '',//法人证件号码  
    // custName: '',//名称
    // merchantMobile: '',//手机号码
    // email: '',//邮箱
    representativeName: '',//法人名称
    // idCard: '',  
    idTermStart: '',//身份证有效期 开始
    idTermEnd: '',  //身份证有效期 结束
    businessLicense: '',  //营业执照编号
    businessTermStart: '', //营业执照有效期  开始
    businessTermEnd: '', //营业执照有效期  结束
    idcard: false,
    license: false,
    idCardImages: { front: '', reverse: '' },//照片显示
    businessImages: { front: '' },//照片显示
    idCardFront: '',//用于存入数据库
    idCardReverse: '',//用于存入数据库
    businessFront: '',//用于存入数据库
    billingFront: '',//用于存入数据库
    userInfo: {},
    WxValidate: null, //wxvalidate 校验表单

// 银行
    index: 0, //选择的下拉列表下标
    region: ['选择省份', '选择城市', '选择县区'],
    defaultAddress: 'defaultAddress',
    billingTypeArr: ['对公', '对私'],
    billingTypeObj: [
      { id: '01', name: '对公' },
      { id: '02', name: '对私' }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate();
    if (this.data.index == 0) {
      this.setData({ photoType: '开户许可证' })
    } else {
      this.setData({ photoType: '银行卡正面照' })
    }
    let params = {
      url: 'comm/bankProvince.do',
      method: 'get',
    }
    http(params).then(res => {
      console.log(res)
      this.setData({
        provinceArr: res.data,
        bankProvinceId: res.data[0].bankProvinceId
      })
      return res.data[0].bankProvinceId;
    }).then(bankProvinceId => {
      params.data = { bankProvinceId: bankProvinceId };
      http(params).then(res => {
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  navBack(){
    wx.navigateBack({
      detal:-1
    })
  },
  // init validate
  initValidate() {
    const rules = {
      custName: { required: true},
      merchantMobile: { required: true ,tel:true},
      email: { required: true, email: true },
      representativeCertNo: { required: true, idcard: true }
    };
    const messages = {
      custName: { required: '请正确填写公司或个人名字' },
      merchantMobile: { required: '请正确填写手机号码' },
      email: { required: '请正确填写邮箱地址' },
      representativeCertNo: { required: '请正确填写身份证号码' }
    };
    this.WxValidate = new validate(rules, messages);
  },
  bindPickerChange: function (e) { //类型
    this.setData({
      typeIndex: e.detail.value
    })
  },
  // 战略服务商切换
  togglecommerceType(e) {
    const index = e.detail.value;
    this.setData({ commerceTypeIndex: index });
    console.log(index);
  },
  // 表单输入
  bindKeyInput(e) {
    const { name } = e.target.dataset;
    const { value } = e.detail;
    const userInfo = Object.assign({}, this.data.userInfo, { [name]: value });
    this.setData({ userInfo });
  },
  // 身份证长期设置
  toggleIDCard() {
    const check = this.data.idCard;
    this.setData({ idCard: !check }, () => {
      this.setData({
        idTermStart: '',
        idTermEnd: ''
      });
    });
  },
  // 营业执照长期设置
  toggleLicense(e) {
    const check = this.data.license;
    this.setData({ license: !check }, () => {
      this.setData({
        businessTermStart: '',
        businessTermEnd: ''
      });
    });
  },
  // choose date
  chooseDate(e) {
    const date = e.detail.value;
    const type = e.currentTarget.dataset.type;
    const reg = new RegExp('idCard');
    const typeCancel = reg.test(type) ? 'idCard' : 'license';
    this.setData({ [type]: date }, () => {
      this.setData({ [typeCancel]: false });
    });
  },
  // upload check
  uploadChoose(e) {
    const chooseType = ['相册中选择', '拍照'];
    const mold = e.currentTarget.dataset.type.split('@');
    wx.showActionSheet({
      itemList: chooseType,
      itemColor: "#699dd7",
      success: ({ tapIndex }) => {
        this.uploadFile(tapIndex, mold);
      },
      fail(err) {
        console.log(err.errMsg)
      }
    })
  },
  // upload preview image
  uploadFile(index, mold) {
    const chooseType = ['album', 'camera'][index];
    const uploadType = `${mold[0]}Images`;
    wx.chooseImage({
      // count: 2,
      sizeType: ['original','compressed'],
      sourceType: [chooseType],
      success: (res) => {
        const file = res.tempFilePaths;
        const val = Object.assign({}, this.data[uploadType], { [mold[1]]: file[0] });
        this.setData({ [uploadType]: val });
        // console.log(val)
        let flag = 'certAttribute1'; 
        if (uploadType == 'idCardImages' && mold[1] == 'front'){
          flag = 'certAttribute1';
        } else if (uploadType == 'idCardImages' && mold[1] == 'reverse'){
          flag = 'certAttribute2';
        } else if (uploadType == 'businessImages'){
          flag = 'businessPhoto';
        }else{
          let params = {
            url: 'common/upload.do',
            tempFilePaths: res.tempFilePaths[0]
          };
          imgUpload(params).then((result) => {
            let res = JSON.parse(result);
            console.log(res)
            let imgUrl = res.data.imagePath;
            this.setData({ billingFront: imgUrl })
          })
          return;
        }
        wx.getFileSystemManager().readFile({
          filePath: file[0], //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调
            const params = {
              url: 'comm/youTu',
              data:{
                flag: flag,
                str: 'data:image/png;base64,'+res.data
              }
            }; 
            http(params).then((result) => {
              console.log(result)
              if (result.result == "FAIL"){
                return tips('照片有误！')
              }
              let cardValidDate = '', idTermStart = '', idTermEnd = '', businessTermStart = '', businessTermEnd='';
              let idCardFront2 = 'idCardImages.front';
              let idCardReverse2 = 'idCardImages.reverse';
              let businessFront2 = 'businessImages.front';
              
              if (uploadType == 'idCardImages' && mold[1] == 'reverse'){
                cardValidDate = result.cardValidDate.replace(/\./g, '-');
                idTermStart = cardValidDate.substring(0, 10);
                idTermEnd = cardValidDate.substring(11, cardValidDate.length);
                if (idTermEnd == '长期') { 
                  this.setData({
                    idTermStart: idTermStart||'',
                    idTermEnd: '长期',
                    idCardReverse: result.imagePath,
                    idCardReverse2: result.imagePath,
                    idcard: true
                  })
                }else{
                  this.setData({
                    idTermStart: idTermStart,
                    idTermEnd: idTermEnd,
                    idCardReverse: result.imagePath,
                    idCardReverse2: result.imagePath,
                    idcard: false
                  })
                }
              } else if (uploadType == 'idCardImages' && mold[1] == 'front') {
                this.data.userInfo.representativeCertNo = result.cardId; 
                this.setData({
                  representativeCertNo: result.cardId,
                  representativeName: result.cardName,
                  idCardFront: result.imagePath,
                  idCardFront2: result.imagePath
                })
                console.log(this.data.idCardImages)
              } else if (uploadType == 'businessImages') {
                if (result.businessTermEnd == '长期') { 
                  this.setData({
                    businessLicense: result.businessLicense,
                    businessTermStart: businessTermStart||'',
                    businessTermEnd: '长期',
                    businessFront: result.imagePath,
                    businessFront2: result.imagePath,
                    license: true
                  })
                }else{
                  this.setData({
                    businessLicense: result.businessLicense,
                    businessTermStart: result.businessTermStart,
                    businessTermEnd: result.businessTermEnd,
                    businessFront: result.imagePath,
                    businessFront2: result.imagePath,
                    license: false
                  })
                }
              }
            });
          }
        })
      }
    })
  },

  // remove image
  removeImage(e) {
    const type = e.currentTarget.dataset.type.split('@');
    const uploadType = `${type[0]}Images`;
    const val = Object.assign({}, this.data[uploadType], { [type[1]]: '' });
    this.setData({ [uploadType]: val });
  },

  /************银行*********************************/
  initBank(params2) {//初始化银行信息
    http(params2).then(res => {
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
      http(params2).then(res => {
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
    http(params).then(res => {
      console.log(res)
      this.setData({
        cityIndex: 0,
        cityArr: res.data,
        bankCityId: res.data[0].bankCityId
      });
      let params2 = {
        url: 'comm/bankBranch',
        method: 'get',
        data: { bankCode: this.data.bankCode, cityCode: res.data[0].bankCityId }
      }
      console.log(params2)
      http(params2).then(res => {
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
      data: { bankCode: this.data.bankCode, cityCode: bankCityId }
    }
    console.log(params2)
    http(params2).then(res => {
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
  billingTypeChange: function (e) {//结算类型
    this.setData({ index: e.detail.value })
    if (e.detail.value == 0) {
      this.setData({ photoType: '开户许可证' })
    } else {
      this.setData({ photoType: '银行卡正面照' })
    }
  },
  bankNo(e) {//验证银行卡号
    let val = e.detail.value;
    if (!bankNo(val)) {
      tips('请正确输入银行卡号！'); return;
    } else {
      for (let i = 0; i < this.data.bankArr.length; i++) {
        this.setData({//由于本地bankiInfo.js中的银行卡号与数据库中的银行卡号不一致所以验证存在问题
          bankNo: e.detail.value,
          bankIndex: i,
          bankCode: this.data.bankArr[i].bankCode
        })
        if (this.data.bankArr[i].bankName == bank.bankInfo(e.detail.value).bankName) {
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
    let val = nameVerifycation(e.detail.value);
    if (!val) {
      tips('请正确输入开户人！'); return;
    } else {
      this.setData({ accountName: e.detail.value });
    }
  },

  // 提交数据
  goToSubmit() {
    const { userInfo } = this.data;
    // console.log(userInfo);
    // const userInfo = {
    //   businessLicense: "111111",
    //   custName: "海俊集团",
    //   representativeName:'海俊',
    //   email: "111111@qq.com",
    //   merchantMobile: "15111111119",
    //   representativeCertNo: "430426196606066666",
    //   representativeName: "何老板",
    //   idTermStart: '2019-12-03',
    //   idTermEnd: '2059-12-08',
    //   businessTermStart: '2010-09-11',
    //   businessTermEnd: '2099-10-12',
    //   custScanCopys: JSON.stringify([{ certifyType: '00', scanCopyPath: 'images/add.png', flag: 1 }, { certifyType: '16', scanCopyPath: 'images/add.png', flag: 1 }, { certifyType: '02', scanCopyPath: 'images/add.png', flag: 1 },])
    // }

    // 校验普通字段
    const flag = this.WxValidate.checkForm(userInfo);
    if (!flag) {
      const err = this.WxValidate.errorList[0];
      wx.showToast({
        title: err.msg,
        icon: 'none'
      });
      return;
    }

    // 校验 图片上传
    const idCard = this.data.idCardImages;
    for (var key in idCard) {
      const str = key === 'front' ? '正面' : '反面';

      if (!idCard[key]) {
        wx.showToast({
          title: `请上传法人身份证${str}照`,
          icon: 'none'
        });
        return;
      }
    }

    if (!bankNo(this.data.bankNo)) { tips('请正确输入银行卡号！'); return; }
    if (!this.data.accountName || this.data.accountName.length > 50) {
      tips('请正确输入开户人！'); return;
    }
    if (!this.data.billingFront) { tips('请上传照片！'); return; }
    let certifyType = '07';
    if (this.data.index == 0) {
       certifyType= '03';
    }

    // 提交数据
    userInfo.serviceLevel = this.data.commerceType[this.data.commerceTypeIndex];
    userInfo.representativeName = this.data.representativeName;
    userInfo.representativeCertNo = this.data.representativeCertNo;
    userInfo.idTermStart = this.data.idTermStart;
    userInfo.idTermEnd = this.data.idTermEnd;
    userInfo.businessLicense = this.data.businessLicense;
    userInfo.businessTermStart = this.data.businessTermStart;
    userInfo.businessTermEnd = this.data.businessTermEnd;
    userInfo.compMainAcct = this.data.bankNo;
    userInfo.compAcctBank = this.data.bankCode;
    userInfo.branchBank = this.data.branchBankCode;
    userInfo.bankProvinceName = this.data.bankProvinceId;
    userInfo.bankCityName = this.data.bankCityId;
    userInfo.bankAcctName = this.data.accountName;
    userInfo.compMainAcctType = this.data.index == 0 ? '01' : '02';
    userInfo.custScanCopys = JSON.stringify([{ certifyType: '04', scanCopyPath: this.data.idCardFront, flag: 1 }, { certifyType: '16', scanCopyPath: this.data.idCardReverse, flag: 1 }, { certifyType: '02', scanCopyPath: this.data.businessFront, flag: 1 }, { certifyType: certifyType, scanCopyPath: this.data.billingFront, flag: 1 }]);
    let custType = 0;
    if (this.data.typeIndex == 1) {
      custType = 2;
    } else if (this.data.typeIndex == 2) {
      custType = 1;
    }
    userInfo.custType = custType;
    const params = Object.assign({
      url:'mchan/addServeMerchant.do',
    }, {data:userInfo});
    console.log(params);//return;
    http(params)
      .then(res => {
        console.log(res);
        if(res.code == 200){
          wx.navigateTo({
            url: '/pages/serviceManager/serviceManager',
          })
        } else if (res.code == 300){
          return tips(res.data.message);
        }else{
          return tips('服务器异常，请稍后重试!');
        }
      })
  },
  goToCancel() {
    wx.navigateBack();
  }
})