const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collection: [],
    col_id: [],
    col_count: 0,
    page: 1,
    openid: "",
    i:0
  },

  toproduct:function(e){
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
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    var openId = this.data.openid;
    var that = this
    const db = wx.cloud.database();
    db.collection('my_interesting').where({
      _openid: openId,
      is_interesting: true
    }).count({
      success: function(res) {
        that.setData({
          col_count: res.total
        })
        var count = that.data.col_count
        if (count == 0) {
          wx.showToast({
            title: '还未收藏商品哦！',
            icon: "none"
          })
        }
        //2、开始查询数据了对应的是集合的名称   
        db.collection('my_interesting').orderBy("collection_time", "desc").where({
          is_interesting: true,
          _openid: openId
        }).get({
          //如果查询成功的话    
          success: res => {
            that.setData({
              col_id: res.data,
            })
            var col_id = that.data.col_id;
            var cc = col_id.length;

            // let arr1 = that.data.collection;
            for (var i = 0; i < cc; i++) {

            // return new Promise((resolve, reject) => {
            //   let arr1 = that.data.collection;
            //   console.log(arr1)
            //   db.collection('second-product').where({
            //     _id: col_id[i].product_id
            //   }).get({
            //     success: res => {
            //       that.setData({
            //         collection: arr1.concat(res.data),
            //       })
            //       var collection = that.data.collection
            //       console.log(collection)
            //       resolve()
            //     }
            //   })
            // })


            let arr1 = that.data.collection;
            db.collection('second-product').where({
              _id: col_id[i].product_id
            }).get({
              
              success: res => {
                arr1.push(res.data[0])
                // arr1=arr1.concat(res.data[0])
                that.setData({
                  collection: arr1,
                  i:count
                })
              }
            })
            }
          }
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
    this.setData({
      collection:[]
    })
    this.onLoad()
    wx.stopPullDownRefresh()
  }
})