const app = getApp()
Page({
  // 跳转到手机数码页面
  tomobile_digital: function(e) {
    wx.navigateTo({
      url: '/pages/mobile_digital/mobile_digital',
    })
  },

  //跳转到生活用品界面
  tolife: function(e) {
    wx.navigateTo({
      url: '/pages/life/life',
    })
  },

  // 转到运动界面
  tosport: function(e) {
    wx.navigateTo({
      url: '/pages/sport/sport',
    })
  },

  // 转到书籍资料界面
  tobook: function(e) {
    wx.navigateTo({
      url: '/pages/book/book',
    })
  },

  //跳转到免费区
  tofree: function(e) {
    wx.navigateTo({
      url: '/pages/free/free',
    })
  },

  //跳转到其他界面
  toother: function(e) {
    wx.navigateTo({
      url: '/pages/other/other',
    })
  },

  // 跳转到商品详情页
  toproduct: function(e) {
    var that = this;
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: '/pages/product_detail/product_detail?product_id=' + id,
    })
  },

  nameinput: function(e) {
    this.setData({
      nameinput: e.detail.value
    })
  },

  search_name: function(e) {
    if (this.data.nameinput.length == 0) {
      wx.showToast({
        title: '请输入搜索内容',
        icon: 'none',
        duration: 2000,
      })
    } else {
      var nameinput = this.data.nameinput
      wx.navigateTo({
        url: '/pages/search/search?input=' + nameinput,
      })
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    nameinput: "",
    second_data: [],
    page: 1,
    count: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    //1、引用数据库   
    const db = wx.cloud.database();
    db.collection('second-product').where({
      sell_shelve: true // 未下架
    }).count({
      success: function(res) {
        _this.setData({
          count: res.total
        })
      }
    })
    //2、开始查询数据了  news对应的是集合的名称   
    db.collection('second-product').limit(4).orderBy("sell_time", "desc").where({
      sell_shelve: true // 未下架
    }).get({
      //如果查询成功的话    
      success: res => {
        // console.log(res.data)
        //这一步很重要，给ne赋值，没有这一步的话，前台就不会显示值      
        _this.setData({
          second_data: res.data,
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
    var that = this;
    that.setData({
      nameinput: ""
    })
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
    var that = this
    that.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    let arr1 = that.data.second_data;
    if (arr1.length < that.data.count) {
      const db = wx.cloud.database();
      db.collection('second-product').skip(arr1.length).limit(5).orderBy("sell_time", "desc").where({
        sell_shelve: true // 未下架
      }).get({
        //如果查询成功的话    
        success: res => {
          that.setData({
            second_data: arr1.concat(res.data),
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