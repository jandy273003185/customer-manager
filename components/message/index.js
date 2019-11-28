// components/homePage/index.js
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
    title: '消息通知',
    arr:[
      {
        name:'松鼠小店',
        date:'2019-10-29 12:18',
        detail:'松鼠小店松鼠小店松鼠小店松鼠小店松鼠小店松鼠小店松鼠小店',
        arrow: 'images/arrow-down.png'
      },
      {
        name: '松鼠小店2',
        date: '2019-10-30 12:18',
        detail: '2松鼠小店松鼠小店松鼠小店松鼠小店松鼠小店松鼠小店松鼠小店',
        arrow: 'images/arrow-down.png'
      }
    ],
    // arrow:'images/arrow-down.png'
    isHide:'isHide'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    navBack() {
      wx.navigateBack({ delta: 1 })
    },
    examine(e){
      let index = 0;
      let arrayItem = this.data.arr;//获取循环数组对象
      for (let item of arrayItem) {
        //如果当前点击的对象id和循环对象里的id一致
        if (item.name == e.currentTarget.dataset.name) {
          //判断当前对象中的isShow是否为true（true为显示，其他为隐藏） 
          if (arrayItem[index].isShow == "" || arrayItem[index].isShow == undefined) {
            arrayItem[index].isShow = true;
            arrayItem[index].arrow = 'images/arrow-up.png'
          } else {
            arrayItem[index].isShow = ""
            arrayItem[index].arrow = 'images/arrow-down.png'
          }
          if (arrayItem[index].isShow2 == "" || arrayItem[index].isShow2 == undefined) { 
            arrayItem[index].isShow2 = true
          }
        }
        index++;
      }
      //将数据动态绑定 
      this.setData({
        arr: arrayItem
      })
    }
  }
})
