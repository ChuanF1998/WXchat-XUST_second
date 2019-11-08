Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var id = options.product_id;
    console.log(id)
    const db = wx.cloud.database();
    db.collection('need-product').where({
      _id: id
    }).get({
      //如果查询成功的话    
      success: res => {
        var year = res.data[0].need_time.getFullYear()
        var month = res.data[0].need_time.getMonth() + 1
        var day = res.data[0].need_time.getDate()
        var data = year + "-" + month + "-" + day
        res.data[0].need_time = data;
        that.setData({
          result: res.data
        })
      },
      fail: err => {
        wx.showToast({
          title: '数据异常',
          icon: "none"
        })
      }
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
  onShow: function () {
    
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var title = this.data.result[0].need_title;
    return {
      title: title
    }
  }
})