// components/homePage/index.js
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
    title: '商户交易',
    dateArr: [
      { id: 0, name: '今日'}, 
      { id: 1, name: '近7天'},
      { id: 2, name: '近30天' },
      { id: 3, name: '自定义时间' }
    ],
    idx:0,
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
    queryStartDate: util.dateFormat("YYYY-mm-dd", new Date()),
    queryEndDate: util.dateFormat("YYYY-mm-dd", new Date()),
    orderBy: 'transactionAmount desc',//排序
    timeStamp:'',
    sortTitle: 'sort-title',
    loadMoreFlag: false
  },

  attached() {
    var self = this;
    util.wxCommon.listApi.getSystemInfo(function (res) {
      var warpHeight = (res.windowHeight - Math.ceil(560 / res.pixelRatio) || 560) + "px";
      self.setData({
        warpHeight: warpHeight
      })
    }, function (er) {
      self.setData({
        warpHeight: "560px"
      })
    });
    // this.queryList();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    inputSearch(e) {
      this.setData({ 
        inputName: e.detail.value
      });
    },
    // 交易列表
    queryList() {
      wx.showLoading();
      let params = {
        url: 'comm/getDealRanking.do',
        method: 'get',
        data: {
          custName: this.data.custName,
          queryStartDate: this.data.queryStartDate,
          queryEndDate: this.data.queryEndDate,
          pageNum: this.data.pageNum,
          pageSize: this.data.pageSize,
          rankingCode: '',
          roleId:1,
          orderBy: this.data.orderBy
        }
      }
      // console.log(params);
      util.http(params).then(data => {
        if (data) {
          // console.log(data)
          wx.hideLoading();
          let arr = this.data.listArr;
          if (!this.data.loadMoreFlag) { arr = []; this.setData({ loadMoreFlag: false }); }
          arr = arr.concat(data.data);
          this.setData({ total: data.total });
          this.setData({ listArr: arr});
          if (arr.length == 0) {
            this.setData({ loadTxt: "暂无数据", loaded: 'loaded' })
          } else if (Number(this.data.pageNum * this.data.pageSize) >= data.total) {
            this.setData({ loadTxt: "已加载全部数据", loaded: 'loaded' })
          }
        }
      }, rejected => {
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
    inputEvent(e){
      this.setData({
        custName: e.detail.value
      });
    },
    clear(e){
      this.setData({
        custName: ''
      });
    },
    loadMore() {//分页
      if (this.data.listArr.length >= this.data.total) { return };
      let pageNum = this.data.pageNum;
      ++pageNum;
      this.setData({ loadMoreFlag: true,pageNum });
      this.queryList();
    },
    onDate(e) {//日期查询（全部。。。）
      let index = e.currentTarget.dataset.index;
      let day=0;
      let dateTemp = 'dateArr[3].name', dateVal = '自定义时间';
      this.setData({
        idx: index,
        [dateTemp]: dateVal
      });

      if (index == 1) {
        day = 7;
      } else if (index == 2) {
        day = 30;
      } else if (index == 3){
        if(this.data.queryStartDate || this.data.queryEndDate){
          this.setData({ startDateHide: 'startDateHide', endDateHide: 'startDateHide' });
        }else{
          this.setData({ startDateHide: '', endDateHide: '' });
        }
        this.alertDate();
        return;
      }
      let queryStartDate = util.dateFormat("YYYY-mm-dd", new Date(util.calculateDay(day)));
      let queryEndDate = util.dateFormat("YYYY-mm-dd", new Date());  
      if (index == 0) { queryStartDate = util.dateFormat("YYYY-mm-dd", new Date()); queryEndDate = util.dateFormat("YYYY-mm-dd", new Date())};
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
    onSort(e){
      // let type = e.currentTarget.dataset.type;
      // let arr = this.data.listArr;
      // let tempFlag = this.data.flag;
      // let newArr = [];
      // if (tempFlag) {//升序
      //   if(type == 0){
      //     arr.sort((a, b) => { return a.transactionNum - b.transactionNum })
      //   }else{
      //     arr.sort((a, b) => { return a.transactionAmount - b.transactionAmount })
      //   }
      //   tempFlag = false;
      // } else {//降序
      //   if (type == 0) {
      //     arr.sort((a, b) => { return b.transactionNum - a.transactionNum })
      //   } else {
      //     arr.sort((a, b) => { return b.transactionAmount - a.transactionAmount })
      //   }
      //   tempFlag = true;
      // };
      // this.setData({
      //   listArr: arr,
      //   flag: tempFlag
      // });
      let type = e.currentTarget.dataset.type;
      let tempFlag = this.data.flag;
      let orderBy = ''; 
      if (tempFlag) {//升序
        if (type == 0) {
          orderBy = 'transactionNum asc';
        }else{
          orderBy = 'transactionAmount asc';
        }
        tempFlag = false;
      }else{
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
      // util.throttle(this.queryList(), 50000);
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
      let startTime = this.data.queryStartDate || util.dateFormat("YYYY-mm-dd", new Date());
      let endTime = this.data.queryEndDate || util.dateFormat("YYYY-mm-dd", new Date());
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
    cancel() {
      this.setData({ dateHide: 'dateHide' });
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
      if (util.getTouchData(endX, endY, this.data.startX, this.data.startY) == "left") {
        wx.switchTab({
          url: '/pages/providers/providers',
        })
      } else if (util.getTouchData(endX, endY, this.data.startX, this.data.startY) == "right") {
        wx.switchTab({
          url: '/pages/commercialTenant/commercialTenant',
        })
      }
    },
  }
})
