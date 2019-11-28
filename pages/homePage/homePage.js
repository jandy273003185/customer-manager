// pages/login.js
let util = require('../../utils/utils.js');
const app=getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    dateHide:false,
    isHide: false,
    date: util.dateFormat("YYYY-mm-dd",new Date()),
    countArr: [],
    listArr: [],
    warpHeight: "", //初始高度置空
    queryStartDate: util.dateFormat("YYYY-mm-dd", new Date()),
    queryEndDate: util.dateFormat("YYYY-mm-dd", new Date()),
    popErrorMsg: app.globalData.popErrorMsg
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    util.wxCommon.listApi.getSystemInfo(function (res) {
      let height = res.platform == 'android' ? 1020 : 730;
      // var warpHeight = (res.windowHeight - Math.ceil(1020 / res.pixelRatio) || 560) + "px";
      var warpHeight = (res.windowHeight - Math.ceil(height / res.pixelRatio) || 560) + "px";
      self.setData({
        warpHeight: warpHeight
      })
    }, function (er) {
      self.setData({
        warpHeight: "560px"
      })
    }); 
  },
  // 商户总数
  queryCount() {
    let params = {
      url: 'comm/getStatCommercial.do',
      method: 'get',
      data: {
        queryStartDate: this.data.queryStartDate,//
        queryEndDate: this.data.queryEndDate,//
      }
    }
    util.http(params).then(data => {
      if (data) {
        this.setData({ countArr: [] })
        // console.log(data)
        this.setData({ countArr: new Array(data)});
      }
    })
  },
  // 商户列表
  queryList() {
    let params = {
      url: 'comm/selectCommercialInfo.do',
      method: 'get',
      data: {
        custName: '',
        stateCode: '',
        queryStartDate: '',//util.dateFormat("YYYY-mm-dd", new Date()),
        queryEndDate: '',//util.dateFormat("YYYY-mm-dd", new Date()),
        pageNum: 1,
        pageSize: 10

      }
    }
    util.http(params).then(data => {
      if (data) {
        console.log(data)
        this.setData({listArr:[]})
        let list = data.data;
        let arr = this.data.listArr;
        for (var i = 0; i < list.length; i++) {
          // list[i]["createTime"] = util.dateFormat("YYYY-mm-dd", new Date(list[i]["createTime"]));
          if (list[i]["state"] == "00") {
            if (list[i]["filingAuditStatus"] == "00") {
              list[i]["state"] = "审核通过";
            } else if (list[i]["filingAuditStatus"] == "01" || list[i]["filingAuditStatus"] == "02") {
              list[i]["state"] = "审核中";
            }
          } else if (list[i]["state"] == "01") {
            list[i]["state"] = "待审核";
          } else if (list[i]["state"] == "02") {
            // list[i]["state"] = "注销";
          } else if (list[i]["state"] == "03") {
            // list[i]["state"] = "冻结";
          } else if (list[i]["state"] == "04") {
            list[i]["state"] = "审核失败";
          } else if (list[i]["state"] == "05") {
            list[i]["state"] = "待完善";
          }
          arr.push(list[i]);
        }
        this.setData({ listArr: arr });
        // console.log(this.data.listArr);
      }
    }, rejected => {
      wx.showToast({
        title: '服务器异常,请稍后重试！',
        icon: 'none',
        duration: 3000
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
 
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    let userStorage = wx.getStorageSync('userStorage');console.log(userStorage)
    if (userStorage.username && userStorage.openId && userStorage.token) {
      this.queryCount(); 
      this.queryList(); 
    }else{
      wx.navigateTo({ url: '/pages/accountLogin/accountLogin'})
    }
  },
  searchCommercialTenant() {
    wx.removeStorageSync('basicStorage');
    wx.removeStorageSync('legalPersonStorage');
    wx.removeStorageSync('billingStorage');
    wx.removeStorageSync('certificateStorage');
    wx.removeStorageSync('basicImgStorage');
    wx.removeStorageSync('legalPersonImgStorage');
    wx.removeStorageSync('billingImgStorage');
    wx.removeStorageSync('merchantsInfoStorage');
    wx.removeStorageSync('merchantsInfoStorage2');
    wx.navigateTo({ url: '/pages/merchantsIntoPieces/merchantsIntoPieces?title=商户进件' });
  },
  dateAlert(e) {//弹出日期窗口
     this.setData({
       dateHide:true
     })
    // app.globalData.dateHide = true;
  },
  bindDateChange(e) {
    this.setData({
      'date': e.detail.value
    })
  },
  onStatus(e) {//查看商户进件状态详情
    let status = e.currentTarget.dataset.status;
    if (status == "待完善") {
      wx.navigateTo({ url: '/pages/merchantsIntoPieces/merchantsIntoPieces?pageName=homePage&custId=' + e.currentTarget.dataset.custid });
    } else if (status == "审核失败") {
      wx.navigateTo({ url: '/pages/checkDetails/checkDetails?pageName=homePage&custId=' + e.currentTarget.dataset.custid});
    } else if (status == "审核通过") {
      wx.navigateTo({ url: '/pages/merchantsInfo/merchantsInfo?pageName=homePage&custId=' + e.currentTarget.dataset.custid });
    }
  },
  message(){//消息通知
    wx.navigateTo({ url: '/pages/message/message' });
  },
  search(){//搜索商户
    wx.navigateTo({ url: '/pages/searchCommercialTenant/searchCommercialTenant' });
  },
  refresh(){
    this.queryCount();
    this.queryList();
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.queryCount();
    this.queryList();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  cancelDate(e){
    this.setData({ dateHide:false});
  },
  confirmDate(e){//选择日期确认
    // console.log(e);
    this.setData({
      date: e.detail.date,
      dateHide: false,
      queryStartDate: e.detail.startDate,
      queryEndDate: e.detail.endDate
    });
    this.queryCount();
  },
  errorHint(e){//进件信息提示
    wx.showToast({
      title: e.detail.msg,
      icon: 'none',
      duration: 3000
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})