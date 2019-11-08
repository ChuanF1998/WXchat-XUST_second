Page({

  /**
   * 页面的初始数据
   */
  data: {
    need: [],
    useinfo: [],
    need_count: 0,
    page: 1,
  },

  // 跳转到商品详情页
  toproduct01: function(e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/product01_detail/product01_detail?product_id=' + id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    //1、引用数据库   
    const db = wx.cloud.database();
    db.collection('need-product').where({
      need_shelve: true, // 未下架
    }).count({
      success: function(res) {
        _this.setData({
          need_count: res.total
        })
      }
    })
    //2、开始查询数据了  news对应的是集合的名称   
    db.collection('need-product').limit(10).orderBy("need_time", "desc").where({
      need_shelve: true, // 未下架
    }).get({
      //如果查询成功的话    
      success: res => {
        _this.setData({
          need: res.data,
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
    let arr1 = that.data.need;
    if (arr1.length < that.data.need_count) {
      const db = wx.cloud.database();
      db.collection('need-product').skip(arr1.length).limit(5).orderBy("need_time", "desc").where({
        need_shelve: true, // 未下架
      }).get({
        //如果查询成功的话    
        success: res => {
          that.setData({
            need: arr1.concat(res.data),
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