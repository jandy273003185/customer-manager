// components/legalPerson/index.js
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
    startDate: '日期选择',
    endDate: '日期选择',
    endDate2:'',
    date: 'date',
    date2: 'date',
    tempFilePaths: 'images/add.png',
    tempFilePaths2: 'images/add.png',
    uploadImg:'',
    uploadTxt:true,
    uploadImg2: '',
    uploadTxt2: true,
    radioVal: 0,
    checked:'',
    representativeName:'',//法人名字
    iDcard:'',//身份证号码
    time:'',//身份证有效期
    name:'',//联系人名字
    mobile:'',//手机
    photo: '',// 身份证正面
    photo2:'',//身份证反面
    arrObj:[],
    flag1:'',
    flag2:''
  },

  attached(){
    let merchantsInfoStorage = wx.getStorageSync('merchantsInfoStorage');
    if (merchantsInfoStorage) {
      console.log(merchantsInfoStorage);
      this.setData({ arrObj: merchantsInfoStorage })
      let startDate = null, endDate = null, time = null, checked = '';
      
      if (merchantsInfoStorage[1].mInfo.idTermEnd == '长期') {
        startDate = '日期选择';
        endDate = '日期选择';
        checked = true;
        this.setData({ radioVal: 1 });
      } else {
        startDate = merchantsInfoStorage[1].mInfo.idTermStart || '日期选择';
        endDate = merchantsInfoStorage[1].mInfo.idTermEnd || '日期选择';
        checked = '';
        this.setData({ radioVal: 0 });
      }
      let img = '', img2 = '';
      for (let i = 0; i < merchantsInfoStorage[0].cInfo.length; i++) {
        if (merchantsInfoStorage[0].cInfo[i].certifyType == '04' && merchantsInfoStorage[0].cInfo[i].scanCopyPath) {
          img = merchantsInfoStorage[5].uri + merchantsInfoStorage[6].url + merchantsInfoStorage[0].cInfo[i].scanCopyPath; this.setData({ uploadImg: 'upload-img', uploadTxt: false, flag1: 2 })
        } else if (merchantsInfoStorage[0].cInfo[i].certifyType == '16' && merchantsInfoStorage[0].cInfo[i].scanCopyPath) {
          img2 = merchantsInfoStorage[5].uri + merchantsInfoStorage[6].url + merchantsInfoStorage[0].cInfo[i].scanCopyPath; this.setData({ uploadImg2: 'upload-img', uploadTxt2: false, flag2: 2 })
        } 
      }

      this.setData({ 
        representativeName: merchantsInfoStorage[1].mInfo.representativeName,
        iDcard: merchantsInfoStorage[1].mInfo.representativeCertNo,
        name: merchantsInfoStorage[1].mInfo.contactName,
        mobile: merchantsInfoStorage[1].mInfo.contactMobile,
        startDate: startDate,
        endDate: endDate,
        checked: checked,
        photo: img,
        photo2: img2,
        tempFilePaths: img == '' ? 'images/add.png' : img,
        tempFilePaths2: img2 == '' ? 'images/add.png' : img2
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

    bindDateChange(e) {//身份证有效期开始时间
      this.setData({
        startDate: e.detail.value,
        // time: e.detail.value +'至'+ this.data.endDate,
        date: '',
        radioVal: 0,
        checked: ''
      })
    },
    bindDateChange2(e) {//身份证有效期结束时间
      this.setData({
        endDate: e.detail.value,
        // time: this.data.startDate + '至' +e.detail.value,
        date2: '',
        radioVal: 0,
        checked: ''
      })
    },
    onRadio(e) {
      if (this.data.radioVal == 0){
        this.setData({
          radioVal: 1,
          startDate: '日期选择',
          endDate: '日期选择',
          endDate2: '长期',
          checked: true
        });
      }else{
        this.setData({
          radioVal: 0,
          checked: ''
        });
      }
      // this.setData({
      //   checked: this.data.checked?true:'',
      //   radioVal: this.data.radioVal?1:0
      // });
    },
    chooseimage: function() {
      var that = this;
      wx.showActionSheet({
        itemList: ['从相册中选择', '拍照'],
        itemColor: "#699dd7",
        success: function(res) {
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
    chooseWxImage: function(type) {
      var that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: [type],
        success: function(res) {
          //console.log(res);
          that.setData({
            tempFilePaths: res.tempFilePaths[0],
            uploadImg:'upload-img',
            uploadTxt: false
          })
          let params = {
            url: 'common/upload.do',
            tempFilePaths: res.tempFilePaths[0]
          };
          console.log(params);
          util.imgUpload(params).then((result) => {
            let res = JSON.parse(result);
            console.log(res)
            let imgUrl = res.data.imagePath;
            that.setData({ photo: imgUrl })
            console.log(that.data.photo)
          })
          
        }
      })
    },
    chooseimage2: function () {
      var that = this;
      wx.showActionSheet({
        itemList: ['从相册中选择', '拍照'],
        itemColor: "#699dd7",
        success: function (res) {
          if (!res.cancel) {
            if (res.tapIndex == 0) {
              that.chooseWxImage2('album')
            } else if (res.tapIndex == 1) {
              that.chooseWxImage2('camera')
            }
          }
        }
      })
    },
    chooseWxImage2: function (type) {
      var that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'],
        sourceType: [type],
        success: function (res) {
          //console.log(res);
          that.setData({
            tempFilePaths2: res.tempFilePaths[0],
            uploadImg2: 'upload-img',
            uploadTxt2: false
          })
          let params = {
            url: 'common/upload.do',
            tempFilePaths: res.tempFilePaths[0]
          };
          util.imgUpload(params).then((result) => {
            let res = JSON.parse(result);
            console.log(res)
            let imgUrl = res.data.imagePath;
            that.setData({ photo2: imgUrl })
            console.log(that.data.photo2)
          })
          
        }
      })
    },
    nextFun() {//下一步
      if (!util.nameVerifycation(this.data.representativeName)){
        wx.showToast({
          title: "请正确输入法人名字！",
          icon: 'none',
          duration: 3000
        })
        return;
      }
      if (!util.iDcard(this.data.iDcard)) {
        wx.showToast({
          title: "请正确输入身份证号码！",
          icon: 'none',
          duration: 3000
        })
        return;
      }
      // if (this.data.radioVal == 0 && (this.data.startDate == '日期选择' || this.data.endDate =='日期选择')) {
      //   wx.showToast({
      //     title: "请选择身份证有效期！",
      //     icon: 'none',
      //     duration: 3000
      //   })
      //   return;
      // }
      if (!util.nameVerifycation(this.data.name)) {
        wx.showToast({
          title: "请正确输入联系人名字！",
          icon: 'none',
          duration: 3000
        })
        return;
      }
      if (!util.mobile(this.data.mobile)) {
        wx.showToast({
          title: "请正确输入手机号！",
          icon: 'none',
          duration: 3000
        })
        return;
      }
      wx.setStorageSync('legalPersonImgStorage', [
        { certifyType: '04', scanCopyPath: this.data.tempFilePaths == (undefined || 'images/add.png') ? '' : this.data.photo, certifyNo: this.data.iDcard, flag: this.data.tempFilePaths == (undefined || 'images/add.png') ? 0 : (this.data.flag1 == 2 ? 2 : 1)},
        { certifyType: '16', scanCopyPath: this.data.tempFilePaths2 == (undefined || 'images/add.png') ? '' : this.data.photo2, certifyNo: '', flag: this.data.tempFilePaths2 == (undefined || 'images/add.png') ? 0 : (this.data.flag2 == 2 ? 2 : 1) }
      ]);
      wx.setStorageSync('legalPersonStorage', {
         representativeName: this.data.representativeName ,
        // representativeName: wx.getStorageSync('legalPersonStorage').representativeName == undefined ? this.data.representativeName : wx.getStorageSync('legalPersonStorage').representativeName,
         representativeCertNo: this.data.iDcard ,
        //  idTermStart : this.data.startDate ,
        //  idTermEnd: this.data.radioVal == 1?"长期": this.data.endDate,
         contactName: this.data.name,
         contactMobile: this.data.mobile
      })
      
      wx.navigateTo({ url: '/pages/billingInfo/billingInfo' });
    },
    back(){
      wx.navigateBack({ delta:1 });
    },
    mobile(e) {//验证手机号
      let val = util.mobile(e.detail.value);
      if (!val) {
        // this.setData({ popErrorMsg: "手机号码有误！" });
        // this.ohShitfadeOut();
        wx.showToast({
          title: "请正确输入手机号！",
          icon: 'none',
          duration: 3000
        })
        return;
      } else {
        this.setData({ mobile: e.detail.value });
      }
    },
    representativeName(e) {//验证法人名字
      let val = util.nameVerifycation(e.detail.value);
      if (!val) {
        wx.showToast({
          title: "请正确输入法人名字！",
          icon: 'none',
          duration: 3000
        })
        return;
      } else {
        this.setData({ representativeName: e.detail.value });
      }
    },
    iDcard(e) {//身份证号码
      let val = util.iDcard(e.detail.value);
      if (!val) {
        wx.showToast({
          title: "请正确输入身份证号码！",
          icon: 'none',
          duration: 3000
        })
        return;
      } else {
        this.setData({ iDcard: e.detail.value });
      }
    },
    nameVerifycation(e) {//联系人名字
      let val = util.nameVerifycation(e.detail.value);
      if (!val) {
        wx.showToast({
          title: "请正确输入联系人名字！",
          icon: 'none',
          duration: 3000
        })
        return;
      } else {
        this.setData({ name: e.detail.value });
      }
    },
    // ohShitfadeOut() {//错误提示框
    //   let fadeOutTimeout = setTimeout(() => {
    //     this.setData({ popErrorMsg: '' });
    //     clearTimeout(fadeOutTimeout);
    //   }, 3000);
    // },
  }
})