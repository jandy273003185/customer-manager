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
      title: '服务商管理',
      isHide: 'isHide',
      custName: '', //搜索商户名称
      warpHeight: "", //初始高度置空
      listArr: [],
      pageNum: 1, //页码
      pageSize: 15,
      total: 0, //总记录数
      loadMoreFlag: false
    },
    attached() {
        var self = this;
        util.wxCommon.listApi.getSystemInfo(function(res) {
            //其中res.windowHeight 则是整个区域的高度，144是class为tab切换按钮的高度
            //因为这里的高度是以px为单位。所以我们需要进行像素比的转换以便可以兼容不同型号的手机
            //这里用或表示如果系统获取成功了但是处于延时的情况。我们可以给他一个默认的高度为560
          // let height = res.platform == 'android' ? 400 : 720;
          // var warpHeight = (res.windowHeight - Math.ceil(height / res.pixelRatio) || 560) + "px";
          let warpHeight = (res.windowHeight - Math.ceil(560 / res.pixelRatio) || 560) + "px"; 
          self.setData({
              warpHeight: warpHeight
          })
        }, function(er) {
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
            // wx.navigateBack({ delta: -1 })
            wx.switchTab({
                url: '/pages/homePage/homePage',
            })
        },
        // 商户列表
        queryList() {
          wx.showLoading();
          let params = {
                url: 'mchan/getFacilitatorList.do',
                method: 'get',
                data: {
                  pageNum: this.data.pageNum,
                  pageSize: this.data.pageSize
                }
              }
              // console.log(params);
          util.http(params).then(res => {
            console.log(res)
            wx.hideLoading();
            if (res.code == 200) {
              this.setData({ total: res.data.total });
                let list = res.data.data;
                if (list.length == 0) {
                    this.setData({ loadTxt: "暂无数据", loaded: 'loaded' })
                } else if (Number(this.data.pageNum * this.data.pageSize) >= res.data.total) {
                    this.setData({ loadTxt: "已加载全部数据", loaded: 'loaded' })
                }
                let arr = this.data.listArr;
                if (!this.data.loadMoreFlag) { arr = []; this.setData({ loadMoreFlag: false }); }
                for (var i = 0; i < list.length; i++) {
                  //00 有效；01 待审核；03 冻结；04 审核不通过
                  //实名认证状态: 0 生效  1 审核中  2 审核不通过 9冻结
                    // list[i]["createTime"] = util.dateFormat("YYYY-mm-dd", new Date(list[i]["createTime"]));
                  if (list[i]["state"] == "0" || list[i]["state"] == "生效") {
                    list[i]["state"] = "生效";
                  } else if (list[i]["state"] == "1" || list[i]["state"] == "审核中") {
                      list[i]["state"] = "审核中";
                    } else if (list[i]["state"] == "2" || list[i]["state"] == "审核不通过") {
                        list[i]["state"] = "审核不通过";
                  } else if (list[i]["state"] == "9" || list[i]["state"] == "冻结") {
                    list[i]["state"] = "冻结";
                    }
                    arr.push(list[i]);
                  // console.log(arr)
                }
                this.setData({ listArr: arr });
                // console.log(this.data.listArr);
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
        inputSearch(e) { //商户名称搜索
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
        loadMore() { //分页
            if (this.data.listArr.length >= this.data.total) { return };
            let pageNum = this.data.pageNum;
            ++pageNum;
          this.setData({ loadMoreFlag: true,pageNum });
            this.queryList();
        },
        onStatus(e) {
            // let status = e.currentTarget.dataset.status;
            // if (status == "待完善") {
            //     wx.navigateTo({ url: '/pages/merchantsIntoPieces/merchantsIntoPieces?pageName=searchCommercialTenant&custId=' + e.currentTarget.dataset.custid });
            // } else if (status == "审核失败") {
            //     wx.navigateTo({ url: '/pages/checkDetails/checkDetails?pageName=searchCommercialTenant&custId=' + e.currentTarget.dataset.custid });
            // } else if (status == "审核通过") {
            //     wx.navigateTo({ url: '/pages/merchantsInfo/merchantsInfo?pageName=searchCommercialTenant&custId=' + e.currentTarget.dataset.custid });
            // }
        },
        addService() {
            wx.navigateTo({ url: '/pages/increase/increase?pageName=increase' });
        }
    }
})