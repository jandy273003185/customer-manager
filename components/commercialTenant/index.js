// components/homePage/index.js
let util = require('../../utils/utils.js');
let app = getApp();
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
    title: '商户',
    statusArr: [
      { id: 888, name: '全部'}, 
      { id: 0, name: '待完善'},
      { id: 1, name: '待审核' },
      { id: 2, name: '审核中' },
      { id: 3, name: '审核失败' },
      { id: 4, name: '审核通过' } 
    ],
    idx:888,
    dateHide:'dateHide',
    isHide: false,
    startDateHide:'',
    endDateHide: '',
    // queryStartDate: util.calculateDay(0),
    // queryEndDate: util.calculateDay(),
    queryStartDate: '',//util.dateFormat("YYYY-mm-dd", new Date()),
    queryEndDate: '',//util.dateFormat("YYYY-mm-dd", new Date()),
    custName: '',//搜索商户名称
    stateCode:'',
    filingAuditStatus:'',
    warpHeight: "", //初始高度置空
    listArr: [],
    pageNum: 1,//页码
    pageSize: 15,
    total: 0,//总记录数
    loaded:'',
    loadTxt:'',
    timeStamp:'',
    loadMoreFlag: false
  },

  attached(){
    var self = this;
    util.wxCommon.listApi.getSystemInfo(function (res) {
      let height = res.platform == 'android' ? 560 : 400;
      var warpHeight = (res.windowHeight - Math.ceil(height / res.pixelRatio) || 560) + "px";
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
    
    // 商户列表
    queryList() {
      wx.showLoading();
      this.setData({ loaded: '' })
      let params = {
        url: 'comm/selectCommercialInfo.do',
        method: 'get',
        data: {
          custName: this.data.custName,
          stateCode: this.data.stateCode,
          filingAuditStatus: this.data.filingAuditStatus,
          queryStartDate: this.data.queryStartDate,
          queryEndDate: this.data.queryEndDate,
          pageNum: this.data.pageNum,
          pageSize: this.data.pageSize

        }
      }
      // console.log(params);
      util.http(params).then(data => {
        if (data) {
          wx.hideLoading();
          // console.log(data)
          this.setData({ total: data.total });
          let list = data.data;
          if (list.length == 0) {
            this.setData({ loadTxt: "暂无数据", loaded: 'loaded'}) 
          } else if (Number(this.data.pageNum * this.data.pageSize) >= data.total) {
            this.setData({ loadTxt: "已加载全部数据", loaded: 'loaded' })
          }
          let arr = this.data.listArr;
          if (!this.data.loadMoreFlag) { arr = []; this.setData({ loadMoreFlag: false }); }
          for (var i = 0; i < list.length; i++) {
            // list[i]["createTime"] = util.dateFormat("YYYY-mm-dd", new Date(list[i]["createTime"]));
            if (list[i]["state"] == "00") {
              if (list[i]["filingAuditStatus"] == "00") {
                list[i]["state"] = "审核通过";
              } else if (list[i]["filingAuditStatus"] == "01") {
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
      }
     )
    },
    refresh(){
      this.setData({
        listArr: [],
        pageNum: 1
      });
      this.queryList();
    },
    inputEvent(e){
      this.setData({
        custName: e.detail.value,
      });
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
    clear(e) {
      this.setData({
        custName: ''
      });
    },
    loadMore() {//分页
      if (this.data.listArr.length >= this.data.total) { return };
      let pageNum = this.data.pageNum;
      ++pageNum;
      this.setData({ loadMoreFlag: true, pageNum });
      this.queryList();
    },
    onCheck(e){//状态查询（全部。。。）
      let index = e.currentTarget.dataset.index;
      this.setData({
        idx: index
      });
      let stateCode = '';
      let filingAuditStatus = '';
      if(index == 0){
        stateCode = '05';
      } else if (index == 1){
        stateCode = '01';
      } else if (index == 2) {
        stateCode = '00';
        filingAuditStatus = '01';
      } else if (index == 3) {
        stateCode = '04';
      } else if (index == 4) {
        stateCode = '00';
        filingAuditStatus = '00';
      }
      let startTimeStamp = this.data.timeStamp;
      this.setData({ timeStamp: e.timeStamp });
      if (e.timeStamp - startTimeStamp > 350) {
        this.setData({
          listArr: [],
          filingAuditStatus: filingAuditStatus,
          stateCode: stateCode,
          pageNum: 1
        });
        this.queryList();
      }
    },
    onStatus(e) {//状态列表
      let status = e.currentTarget.dataset.status;
      // console.log(e)
      if (status == "待完善") {
        wx.navigateTo({ url: '/pages/merchantsIntoPieces/merchantsIntoPieces?pageName=commercialTenant&custId=' + e.currentTarget.dataset.custid });
      } else if (status == "审核失败") {
        wx.navigateTo({ url: '/pages/checkDetails/checkDetails?pageName=commercialTenant&custId=' + e.currentTarget.dataset.custid });
      } else if (status == "审核通过") {
        wx.navigateTo({ url: '/pages/merchantsInfo/merchantsInfo?pageName=commercialTenant&custId=' + e.currentTarget.dataset.custid });
      }
    },
    alertDate() {
      this.setData({ dateHide: '' });
    },
    bindDateChange(e) {
      this.setData({
        'queryStartDate': e.detail.value,
        'startDateHide':'startDateHide'
      })
    },
    bindDateChange2(e) {
      this.setData({
        'queryEndDate': e.detail.value,
        'endDateHide': 'endDateHide'
      })
    },
    confirmSubmit() {//日期
      this.setData({
        listArr: [],
        pageNum: 1
      });
      this.queryList();
      this.setData({ dateHide: 'dateHide' });
    },
    cancel() {
      this.setData({ dateHide: 'dateHide'});
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
          url: '/pages/deal/deal',
        })
      } else if (util.getTouchData(endX, endY, this.data.startX, this.data.startY) == "right"){
        wx.switchTab({
          url: '/pages/homePage/homePage',
        })
      }
    },
  }
})
