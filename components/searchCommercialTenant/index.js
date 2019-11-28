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
    title: '搜索商户',
    isHide:'isHide',
    custName:'',//搜索商户名称
    warpHeight: "", //初始高度置空
    listArr:[],
    pageNum: 1,//页码
    pageSize: 15,
    total: 0,//总记录数
  },
  attached(){
    var self = this;
    util.wxCommon.listApi.getSystemInfo(function (res) {
      //其中res.windowHeight 则是整个区域的高度，144是class为tab切换按钮的高度
      //因为这里的高度是以px为单位。所以我们需要进行像素比的转换以便可以兼容不同型号的手机
      //这里用或表示如果系统获取成功了但是处于延时的情况。我们可以给他一个默认的高度为560
      let height = res.platform == 'android' ? 400 : 280;
      var warpHeight = (res.windowHeight - Math.ceil(height / res.pixelRatio) || 560) + "px";
      self.setData({
        warpHeight: warpHeight
      })
    }, function (er) {
      //错误时候抛出错误同时初始化高度为默认高度
      // common.messageBox.showModal("获取系统信息失败");
      self.setData({
        warpHeight: "560px"
      })
    }); 
  },
  /**
   * 组件的方法列表
   */
  methods: {
    navBack() {
      // wx.navigateBack({ delta: 1 })
      wx.switchTab({
        url: '/pages/homePage/homePage',
      })
    },
    // 商户列表
    queryList() {
      let params = {
        url: 'comm/selectCommercialInfo.do',
        method: 'get',
        data: {
          custName: this.data.custName,
          stateCode: '',
          queryStartDate: '',
          queryEndDate: '',
          pageNum: this.data.pageNum,
          pageSize: this.data.pageSize

        }
      }
      console.log(params);
      util.http(params).then(data => {
        if (data) {
          console.log(data)
          this.setData({ total: data.total });
          let list = data.data;
          if (list.length == 0) {
            this.setData({ loadTxt: "暂无数据", loaded: 'loaded' })
          } else if (Number(this.data.pageNum * this.data.pageSize) >= data.total) {
            this.setData({ loadTxt: "已加载全部数据", loaded: 'loaded' })
          }
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
    refresh() {
      this.setData({
        listArr: [],
        pageNum: 1
      });
      this.queryList();
    },
    inputSearch(e){//商户名称搜索
      let custName = e.detail.value;
      this.setData({ 
        custName: custName,
        listArr: [],
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
      if(this.data.listArr.length >= this.data.total){return};
      let pageNum = this.data.pageNum; 
      ++pageNum ;
      this.setData({ pageNum});
      this.queryList();
    },
    onStatus(e) {
      let status = e.currentTarget.dataset.status;
      if (status == "待完善") {
        wx.navigateTo({ url: '/pages/merchantsIntoPieces/merchantsIntoPieces?pageName=searchCommercialTenant&custId=' + e.currentTarget.dataset.custid });
      } else if (status == "审核失败") {
        wx.navigateTo({ url: '/pages/checkDetails/checkDetails?pageName=searchCommercialTenant&custId=' + e.currentTarget.dataset.custid });
      } else if (status == "审核通过") {
        wx.navigateTo({ url: '/pages/merchantsInfo/merchantsInfo?pageName=searchCommercialTenant&custId=' + e.currentTarget.dataset.custid });
      }
    },
  }
})
