Page({

  /**
   * 页面的初始数据
   */
  data: {
    search_list: [],
    search_count: 0,
    regexp: ""
  },

  // 跳转到商品详情页
  toproduct: function(e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/product_detail/product_detail?product_id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var input = options.input
    console.log(input)
    const db = wx.cloud.database()
    var that = this
    db.collection('second-product').where({
      //使用正则查询，实现对搜索的模糊查询
      sell_title: db.RegExp({
        regexp: input,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
    }).count({
      success: res => {
        that.setData({
          search_count: res.total
        })
      }
    })

    db.collection('second-product').where({
      //使用正则查询，实现对搜索的模糊查询
      sell_title: db.RegExp({
        regexp: input,
        //从搜索栏中获取的value作为规则进行匹配。
        options: 'i',
        //大小写不区分
      })
    }).get({
      success: res => {
        that.setData({
          search_list: res.data
        })
      },
      fail: function(res) {
        wx.showToast({
          title: "数据异常",
          icon: "none",
          duration: 2000,
        })
      }
    })
    if(that.data.search_count==0){
      wx.showToast({
        title: "未找到有效数据",
        icon: "none",
       duration: 2000,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})