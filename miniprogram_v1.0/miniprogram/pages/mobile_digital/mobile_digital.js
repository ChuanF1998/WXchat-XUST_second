Page({

  /**
   * 页面的初始数据
   */
  data: {
    digital: [],
    digital_count: 0,
    page: 1,
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
    var _this = this;
    //1、引用数据库   
    const db = wx.cloud.database();
    db.collection('second-product').where({
      sell_shelve: true, // 未下架
      sell_class: "0"
    }).count({
      success: function(res) {
        _this.setData({
          digital_count: res.total
        })
      }
    })
    //2、开始查询数据了  news对应的是集合的名称   
    db.collection('second-product').limit(10).orderBy("sell_time", "desc").where({
      sell_shelve: true, // 未下架
      sell_class: "0"
    }).get({
      //如果查询成功的话    
      success: res => {
        _this.setData({
          digital: res.data,
        })
      }
    })
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
    var that = this;
    that.onLoad();
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    let arr1 = that.data.digital;
    if (arr1.length < that.data.digital_count) {
      const db = wx.cloud.database();
      db.collection('second-product').skip(arr1.length).limit(5).orderBy("sell_time", "desc").where({
        sell_shelve: true, // 未下架
        sell_class: "0"
      }).get({
        //如果查询成功的话    
        success: res => {
          that.setData({
            digital: arr1.concat(res.data),
            page: that.data.page * 1 + 1,
          })
        },
        fail: function(res) {
          wx.showToast({
            title: '数据异常',
            icon: 'none',
            duration: 2000,
          })
        }
      })
    } else {
      wx.showToast({
        title: '没有更多数据了',
        icon: 'none',
        duration: 2000,
      })
    }

  },

})