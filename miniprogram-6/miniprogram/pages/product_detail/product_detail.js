Page({

  /**
   * 页面的初始数据
   */
  data: {
    // sell_title: "",
    // sell_detail: "",
    // sell_connect: "",
    // sell_press: "",
    result:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
   var id=options.product_id;
    const db = wx.cloud.database();
    db.collection('second-product').where({
      _id: id
    }).get({
      //如果查询成功的话    
      success: res => {
        var time= res.data[0].sell_time.toLocaleDateString()
        res.data[0].sell_time=time;
        that.setData({
          // sell_title: res.data.sell_title,
          // sell_detail: res.data.sell_detail,
          // sell_connect: res.data.sell_connect,
          // sell_press: res.data.sell_press,
          result:res.data
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
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