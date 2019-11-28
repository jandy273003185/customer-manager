// components/alert/index.js
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
    timeArr: [
      { id: 0, name: '近7天' },
      { id: 1, name: '近30天' },
      { id: 2, name: '自定义时间' }
    ],
    idx: 0,
    startTime: util.calculateDay(7),
    endTime: util.calculateDay()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onTime(e) {//选择天数
      let index = e.currentTarget.dataset.index;
      let time, time2 = util.calculateDay();;
      if (index == 0 || index == 2){
        time = util.calculateDay(7);
      } else if (index == 1 || index == 2){
        time = util.calculateDay(30);
      }else{
        // time = '';
        // time2 = '';
      }
      this.setData({
        idx: index,
        startTime: time,
        endTime: time2
      });
    },
    bindDateChange(e) {//开始日期
      this.setData({
        'startTime': e.detail.value
      })
    },
    bindDateChange2(e) {
      this.setData({//结束日期
        'endTime': e.detail.value
      })
    },
    confirmSubmit(){//确认
      let time = this.data.idx;
      let startTime = this.data.startTime;
      let endTime = this.data.endTime;
      let txt= '';
      let sdate = new Date(startTime);
      let edate = new Date(endTime);
      let days = edate.getTime() - sdate.getTime();
      let day = parseInt(days / (1000 * 60 * 60 * 24));
     
      if(time == 0){
        txt = '近7天';
      } else if (time == 1){
        txt = '近30天';
      }else{
        // txt = `近${day}天`;
        txt = startTime + ' 至 ' + endTime;
      }
      this.triggerEvent('myEvent2', { 'date': txt, 'startDate': startTime, 'endDate': endTime});
    },
    cancel(){//取消
      this.triggerEvent('myEvent',{'hide':'hide'});
    }
  }
})
