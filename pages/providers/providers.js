import { http, wxCommon, calculateDay, dateFormat, getTouchData } from '../../utils/utils.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'服务商交易',
    dateArr: [
      { id: 0, name: '今日' },
      { id: 1, name: '近7天' },
      { id: 2, name: '近30天' },
      { id: 3, name: '自定义时间' }
    ],
    idx: 0,
    custName: '',//搜索商户名称
    warpHeight: "", //初始高度置空
    listArr: [],
    pageNum: 1,//页码
    pageSize: 15,
    total: 0,//总记录数
    flag: true,
    dateHide: 'dateHide',
    startDateHide: '',
    endDateHide: '',
    queryStartDate: dateFormat("YYYY-mm-dd", new Date()),
    queryEndDate: dateFormat("YYYY-mm-dd", new Date()),
    orderBy: 'transactionAmount desc',//排序
    timeStamp: '',
    sortTitle: 'sort-title',
    loadMoreFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryList();
    wxCommon.listApi.getSystemInfo(res=> {
      // let height = res.platform == 'android' ? 400 : 720;
      // var warpHeight = (res.windowHeight - Math.ceil(height / res.pixelRatio) || 560) + "px";
      let warpHeight = (res.windowHeight - Math.ceil(560 / res.pixelRatio) || 560) + "px"; 
      this.setData({
        warpHeight: warpHeight
      })
    }, function (er) {
      this.setData({
        warpHeight: "560px"
      })
    });
    // this.queryList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  // go to 服务商详情页
  goToProvidersDetail(e) {
    const id = e.target.dataset;
    wx.navigateTo({
      url: '/pages/particulars/particulars',
    })
    console.log(id);
  },
  // 交易列表
  queryList() {
    wx.showLoading();
    let params = {
      url: 'mchan/getCommDealRanking.do',
      method: 'get',
      data: {
        custName: this.data.custName,
        queryStartDate: this.data.queryStartDate,
        queryEndDate: this.data.queryEndDate,
        pageNum: this.data.pageNum,
        pageSize: this.data.pageSize,
        orderBydc: this.data.orderBy
      }
    }
    console.log(params);
    http(params).then(data => {
      if (data) {
        console.log(data) 
        wx.hideLoading();
        let arr = this.data.listArr;
        if (!this.data.loadMoreFlag) { arr = []; this.setData({ loadMoreFlag: false });}
        arr = arr.concat(data.data);
        this.setData({ total: data.total });
        this.setData({ listArr: arr });
        if (arr.length == 0) {
          this.setData({ loadTxt: "暂无数据", loaded: 'loaded' })
        } else if (Number(this.data.pageNum * this.data.pageSize) >= data.total) {
          this.setData({ loadTxt: "已加载全部数据", loaded: 'loaded' })
        }
      }
    }, rejected => {
      wx.hideLoading();
      wx.showToast({
        title: '服务器异常,请稍后重试！',
        icon: 'none',
        duration: 3000
      })
    })
  },
  refresh() {
    this.setData({
      listArr: [],
      pageNum: 1
    });
    this.queryList();
  },
  inputSearch(e) {//搜索商户名称
    let custName = e.detail.value;
    this.setData({
      listArr: [],
      custName: custName,
      pageNum: 1
    });
    this.queryList();
  },
  inputEvent(e) {
    this.setData({
      custName: e.detail.value
    });
  },
  clear(e) {
    this.setData({
      custName: ''
    });
  },
  loadMore() {//分页
    if (this.data.listArr.length >= this.data.total) { return };
    let pageNum = this.data.pageNum;
    ++pageNum;
    this.setData({ loadMoreFlag:true,pageNum });
    this.queryList();
  },
  onDate(e) {//日期查询（全部。。。）
    let index = e.currentTarget.dataset.index;
    let day = 0;
    let dateTemp = 'dateArr[3].name', dateVal = '自定义时间';
    this.setData({
      idx: index,
      [dateTemp]: dateVal
    });

    if (index == 1) {
      day = 7;
    } else if (index == 2) {
      day = 30;
    } else if (index == 3) {
      if (this.data.queryStartDate || this.data.queryEndDate) {
        this.setData({ startDateHide: 'startDateHide', endDateHide: 'startDateHide' });
      } else {
        this.setData({ startDateHide: '', endDateHide: '' });
      }
      this.alertDate();
      return;
    }
    let queryStartDate = dateFormat("YYYY-mm-dd", new Date(calculateDay(day)));
    let queryEndDate = dateFormat("YYYY-mm-dd", new Date());
    if (index == 0) { queryStartDate = dateFormat("YYYY-mm-dd", new Date()); queryEndDate = dateFormat("YYYY-mm-dd", new Date()) };
    let startTimeStamp = this.data.timeStamp;
    this.setData({ timeStamp: e.timeStamp });
    if (e.timeStamp - startTimeStamp > 350) {
      this.setData({
        listArr: [],
        queryStartDate: queryStartDate,
        queryEndDate: queryEndDate,
        pageNum: 1
      });
      this.queryList();
    }
  },
  onSort(e) {
    let type = e.currentTarget.dataset.type;
    let tempFlag = this.data.flag;
    let orderBy = '';
    if (tempFlag) {//升序
      if (type == 0) {
        orderBy = 'transactionNum asc';
      } else {
        orderBy = 'transactionAmount asc';
      }
      tempFlag = false;
    } else {
      if (type == 0) {
        orderBy = 'transactionNum desc';
      } else {
        orderBy = 'transactionAmount desc';
      }
      tempFlag = true;
    }
    let startTimeStamp = this.data.timeStamp;
    this.setData({ timeStamp: e.timeStamp });
    if (e.timeStamp - startTimeStamp > 350) {
      this.setData({
        listArr: [],
        orderBy: orderBy,
        flag: tempFlag,
        pageNum: 1
      });
      this.queryList()
    }
    // throttle(this.queryList(), 50000);
  },
  alertDate() {
    this.setData({ dateHide: '' });
  },
  bindDateChange(e) {
    this.setData({
      'queryStartDate': e.detail.value,
      'startDateHide': 'startDateHide'
    })
  },
  bindDateChange2(e) {
    this.setData({
      'queryEndDate': e.detail.value,
      'endDateHide': 'endDateHide'
    })
  },
  confirmSubmit() {//日期
    let startTime = this.data.queryStartDate || dateFormat("YYYY-mm-dd", new Date());
    let endTime = this.data.queryEndDate || dateFormat("YYYY-mm-dd", new Date());
    let sdate = new Date(startTime);
    let edate = new Date(endTime);
    let days = edate.getTime() - sdate.getTime();
    let day = parseInt(days / (1000 * 60 * 60 * 24));

    this.setData({ dateHide: 'dateHide' });
    // if (day == 0) { return; }
    let dateTemp = 'dateArr[3].name', dateVal = `近${day}天`;
    this.setData({
      listArr: [],
      pageNum: 1,
      // [dateTemp]: dateVal
    });
    this.queryList();
  },
  providerDetails(e) {
    wx.navigateTo({
      url: '/pages/particulars/particulars?custId=' + e.currentTarget.dataset.custid + '&custname=' + e.currentTarget.dataset.custname + '&queryStartDate=' + this.data.queryStartDate + '&queryEndDate=' + this.data.queryEndDate,
    })
  },
  cancel() {
    this.setData({ dateHide: 'dateHide' });
  },
  /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.setData({
      queryStartDate: dateFormat("YYYY-mm-dd", new Date()),
      queryEndDate: dateFormat("YYYY-mm-dd", new Date()),
      pageNum: 1,
      pageSize: 15,
      listArr: []
    })
    this.queryList();
    // 隐藏导航栏加载框
    wx.hideNavigationBarLoading();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },
  touchStart(e) {
    this.setData({
      "startX": e.changedTouches[0].clientX,
      "startY": e.changedTouches[0].clientY
    });
  },
  touchEnd(e) {
    let endX = e.changedTouches[0].clientX;
    let endY = e.changedTouches[0].clientY;
    if (getTouchData(endX, endY, this.data.startX, this.data.startY) == "right") {
      wx.switchTab({
        url: '/pages/deal/deal',
      })
    }
  },
})