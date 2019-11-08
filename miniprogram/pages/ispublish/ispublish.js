// pages/mypublish/mypublish.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    ispublish: [],
    ispublish_count: 0,
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

  //选项页
  mune: function(e) {
    var that=this;
    var id = e.currentTarget.id;
    console.log(id);
    wx.showActionSheet({
      itemList: ["下架"],
      success(res) {
        if (res.tapIndex == 0) {

          const db = wx.cloud.database();
          db.collection('second-product').doc(id).update({
            data: {
              sell_shelve: false
            },
            success:function(){
              wx.showToast({
                title:"下架成功"
              }),
              that.onLoad();
            },
            fail:function(){
              wx.showToast({
                title: '下架失败',
                icon:"none",
              })
            }
          })
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    //1、引用数据库   
    if (app.globalData.openid) {
      _this.setData({
        openid: app.globalData.openid
      })
    }
    var openId = _this.data.openid;
    const db = wx.cloud.database();
    db.collection('second-product').where({
      sell_shelve: true, // 未下架
      _openid: openId
    }).count({
      success: function(res) {
        _this.setData({
          ispublish_count: res.total
        })
        if (_this.data.ispublish_count == 0) {
          wx.showToast({
            title: '还未发布商品哦',
            icon: "none"
          })
        }
      },
      fail: err => {
        wx.showToast({
          title: '数据异常',
          icon: "none"
        })
      }
    })
    //2、开始查询数据了  news对应的是集合的名称   
    db.collection('second-product').limit(10).orderBy("sell_time", "desc").where({
      sell_shelve: true, // 未下架
      _openid: openId
    }).get({
      //如果查询成功的话    
      success: res => {
        _this.setData({
          ispublish: res.data,
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
    var that = this
    that.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    var openId = that.data.openid;
    let arr1 = that.data.ispublish;
    if (arr1.length < that.data.ispublish_count) {
      const db = wx.cloud.database();
      db.collection('second-product').skip(arr1.length).limit(5).orderBy("sell_time", "desc").where({
        sell_shelve: true, // 未下架
        _openid: openId
      }).get({
        //如果查询成功的话    
        success: res => {
          that.setData({
            ispublish: arr1.concat(res.data),
            page: that.data.page * 1 + 1,
          })
        },
        fail: function(res) {
          that.setData({
            loading: false,
            load: true,
          })
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