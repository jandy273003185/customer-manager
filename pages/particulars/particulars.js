import {
  http
} from '../../utils/utils.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title:'',
    dateHide: false,
    particularsList: ['', ''],
    custId:'',
    queryStartDate: '',
    queryEndDate: '',
    avgNum: '',
    commercialNum: '',
    effectiveSum: '',
    passingRateNum: '',
    perfectSum: '',
    reviewSum: '',
    transactionAmount: '',
    transactionNum: '',
    particularsList:[],
    date:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      date: options.queryStartDate + ' 至 ' + options.queryEndDate,
      custId: options.custId,
      title: options.custname,
      queryStartDate: options.queryStartDate,
      queryEndDate: options.queryEndDate
    })
    this.queryCount();
    this.queryList();
   },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () { },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    // console.log(options)
   },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () { },
  // 商户总数
  queryCount() {
    let params = {
      url: 'mchan/getCommPerformanceInfo.do',
      method: 'get',
      data: {
        custId:this.data.custId,
        queryStartDate: this.data.queryStartDate, //
        queryEndDate: this.data.queryEndDate, //
      }
    }
    console.log(params)
    http(params).then(res => {
      if (res.code == 200) {
        this.setData({ countArr: [] })
        console.log(res)
        this.setData({
          avgNum: res.data.avgNum,
          commercialNum: res.data.commercialNum,
          effectiveSum: res.data.effectiveSum,
          passingRateNum: res.data.passingRateNum,
          perfectSum: res.data.perfectSum,
          reviewSum: res.data.reviewSum,
          transactionAmount: res.data.transactionAmount,
          transactionNum: res.data.transactionNum,
        });
      }
    })
  },
  // 列表
  queryList() {
    // wx.showLoading();
    let params = {
      url: 'mchan/commRankinfo.do',
      method: 'get',
      data: {
        custId: this.data.custId,
        queryStartDate: this.data.queryStartDate, //
        queryEndDate: this.data.queryEndDate, //
      }
    }
    console.log(params);
    http(params).then(data => {
      if (data.code == 200) {
        console.log(data)
        // wx.hideLoading();
        if (data.data.length == 0) {
          this.setData({ loadTxt: "暂无数据", loaded: 'loaded' })
        }else{
          this.setData({
            particularsList:data.data
          })
        }
      }
    }, rejected => {
      // wx.hideLoading();
      wx.showToast({
        title: '服务器异常,请稍后重试！',
        icon: 'none',
        duration: 3000
      })
    })
  },
  customData() {
    this.setData({
      dateHide: true
    });
  },
  cancelDate() {
    this.setData({
      dateHide: false
    });
  },
  confirmDate(e) {
    const {
      startDate,
      endDate
    } = e.detail;
    console.log(e);
    console.log(startDate, endDate);
    const data = {};
    this.setData({
      date: startDate +' 至 '+ endDate,
      custId: this.data.custId,
      queryStartDate: startDate, //
      queryEndDate: endDate, //
      dateHide: false
    }, () => {
      //根据自定义时间来请求数据
      this.queryCount();
      this.queryList();
    });
  },
  // 获取列表数据
  getParticularsList(params) {
    http(params)
      .then(res => {
        console.log(res);
      })
  },
  navBack(){
    wx.navigateBack({
      detal:-1
    })
  }
})