const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    db_id: "",
    id: "",
    openid: "",
    result: [],
    show01: true,
    show02: false,
    true_count: 0,
    false_count: 0
  },

  //图片点击事件
  img: function(event) {
    let arr = [];
    arr.push(this.data.result[0].images_fileID);
    var src = event.currentTarget.dataset.src; //获取data-src
    // var imgList = that.data.result.images_fileID;
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: arr[0] // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      id: options.product_id
    })
    if (app.globalData.openid) {
      this.setData({
        openid: app.globalData.openid
      })
    }
    var openid = this.data.openid;
    var id = this.data.id;
    const db = wx.cloud.database();
    db.collection('my_interesting').where({
      product_id: id,
      _openid: openid,
      is_interesting: true
    }).count({
      success: res => {
        this.setData({
          true_count: res.total
        })
        var count = this.data.true_count;
        if (count != 0) {
          this.setData({
            show01: false,
            show02: true
          })
        }
      }
    })
    var that = this;
    var id = that.data.id;
    db.collection('second-product').where({
      _id: id
    }).get({
      //如果查询成功的话    
      success: res => {
        var time = res.data[0].sell_time.toLocaleDateString()
        res.data[0].sell_time = time;
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

  //心形图标
  in01: function(e) {
    var openid = this.data.openid;
    var id = this.data.id;
    const db = wx.cloud.database();
    db.collection('my_interesting').where({
      product_id: id,
      _openid: openid,
      is_interesting: false
    }).count({
      success: res => {
        this.setData({
          false_count: res.total
        })
        var that = this
        if (that.data.true_count == 0 && that.data.false_count == 0) {
          db.collection('my_interesting').add({
            data: {
              product_id: id,
              is_interesting: true,
              collection_time: db.serverDate()
            },
            success: res => {
              that.setData({
                show01: false,
                show02: true
              })
              wx.showToast({
                title: '收藏成功',
                duration: 1500
              })
            }
          })
        } else {
          db.collection('my_interesting').where({
            product_id: id,
            _openid: openid,
            is_interesting: false
          }).get({
            success: res => {
              that.setData({
                db_id: res.data[0]._id
              })
              var db_id = that.data.db_id;
              db.collection('my_interesting').doc(db_id).update({
                data: {
                  is_interesting: true
                },
                success: res => {
                  that.setData({
                    show01: false,
                    show02: true
                  })
                  wx.showToast({
                    title: "收藏成功",
                    duration: 1500
                  })
                }
              })
            }
          })
        }
      }
    })

  },

  in02: function(e) {
    var that = this;
    var openid = that.data.openid;
    var id = that.data.id;
    const db = wx.cloud.database();
    db.collection('my_interesting').where({
      product_id: id,
      _openid: openid,
      is_interesting: true
    }).get({
      success: res => {
        console.log(res)
        that.setData({
          db_id: res.data[0]._id
        })
        var db_id = that.data.db_id;
        db.collection('my_interesting').doc(db_id).update({
          data: {
            is_interesting: false
          },
          success: res => {
            that.setData({
              show01: true,
              show02: false
            })
            wx.showToast({
              title: "取消成功",
              duration: 1500
            })
          }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var title = this.data.result[0].sell_title;
    return {
      title: title
    }
  }
})