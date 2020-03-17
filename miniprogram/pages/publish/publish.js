const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    openid: "",
    files: [],
    images_fileID: [],
    sell_title: "",
    sell_detail: "",
    sell_connect: "",
    sell_press: "",
    sell_class: "",
    sell_shelve: true,
    sell_live: true,
    need_title: "",
    need_detail: "",
    need_connect: "",
    need_shelve: true,
    need_live: true,
    tip: "",
    item: 0,
    tab: 0,
    array: ['手机数码', '运动休闲', '生活用品', '书籍资料', '免费区', '其他'],
    objectArray: [{
        // class_id: 0,
        name: '手机数码'
      },
      {
        // class_id: 1,
        name: '运动休闲'
      },
      {
        // class_id: 2,
        name: '生活用品'
      },
      {
        // class_id: 3,
        name: '书籍资料'
      },
      {
        // class_id: 4,
        name: '免费区'
      },
      {
        // class_id: 5,
        name: '其他'
      }
    ],
  },

  //获取图片
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function(res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });

      }
    })
  },


  //删除图片
  deleteimage: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var files = that.data.files;
    files.splice(index, 1); //从数组中删除index下标位置，指定数量1，返回新的数组
    that.setData({
      files: files,
    })
  },

  //获取商品名
  nameinput: function(e) {
    this.setData({
      sell_title: e.detail.value
    })
  },

  //获取商品详情
  detailinput: function(e) {
    this.setData({
      sell_detail: e.detail.value
    })
  },

  //获取联系方式
  contactinput01: function(e) {
    this.setData({
      sell_connect: e.detail.value
    })
  },

  // 获取价格
  pressInput: function(e) {
    this.setData({
      sell_press: e.detail.value
    })
    var sell_press = this.data.sell_press;
    var int = parseInt(sell_press)
    this.data.sell_press = int
  },

  //获取分类,选择框
  bindPickerChange: function(e) {
    this.setData({
      sell_class: e.detail.value
    })
    var q = this;
    if (q.data.sell_class == "4") {
      q.setData({
        sell_press: 0
      })
    }
  },

  // 获取需求标题
  needwhat_input: function(e) {
    this.setData({
      need_title: e.detail.value
    })
  },

  //获取需求详情
  whatdetailinput: function(e) {
    this.setData({
      need_detail: e.detail.value
    })
  },

  //获取需求联系方式
  contactinput02: function(e) {
    this.setData({
      need_connect: e.detail.value
    })
  },


  // 换页面
  changeItem: function(e) {
    this.setData({
      item: e.target.dataset.item
    })
  },

  changeTab: function(e) {
    this.setData({
      tab: e.detail.current
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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

  //form获取发布二手商品信息
  getsubmit: function(e) {
    var that = this;
    var get = this.data;
    if (get.files.length == 0) {
      wx.showToast({
        title: '至少添加一张图片',
        icon: "none",
        duration: 2000
      })
    } else if (get.sell_title.length == 0) {
      wx.showToast({
        title: '标题不能为空！',
        icon: "none",
        duration: 2000
      })
    } else if (get.sell_connect.length == 0) {
      wx.showToast({
        title: '联系方式不能为空！',
        icon: "none",
        duration: 2000
      })
    } else if (get.sell_press.length == 0) {
      wx.showToast({
        title: '价格不能为空！',
        icon: "none",
        duration: 2000
      })
    } else if (get.sell_class.length == 0) {
      wx.showToast({
        title: '分类不能为空！',
        icon: "none",
        duration: 2000
      })
    } else {
      wx.showLoading({
        title: '正在发布',
      })
      const db = wx.cloud.database();
      var imageFiles = that.data.files;
      for (var i = 0; i < imageFiles.length; i++) {
        var imageUrl = imageFiles[i].split("/");
        var name = imageUrl[imageUrl.length - 1]; //得到图片的名称
        var images_fileID = that.data.images_fileID; //得到data中的fileID
        wx.cloud.uploadFile({
          //云存储路径
          cloudPath: "second-product-images/" + name,
          filePath: imageFiles[i], //文件临时路径
          success: res => {
            images_fileID.push(res.fileID);
            that.setData({
              images_fileID: images_fileID //更新data中的 fileID
            })
            if (images_fileID.length === imageFiles.length) {
              var get = this.data;
              db.collection('second-product').add({
                data: {
                  sell_title: get.sell_title,
                  sell_detail: get.sell_detail,
                  sell_connect: get.sell_connect,
                  sell_press: get.sell_press,
                  sell_class: get.sell_class,
                  sell_shelve: get.sell_shelve,
                  sell_live: get.sell_live,
                  sell_time: db.serverDate(),
                  images: get.files,
                  images_fileID: get.images_fileID
                },
                success: res => {
                  wx.hideLoading();
                  // 在返回结果中会包含新创建的记录的 _id
                  this.setData({
                    sell_title: "",
                    sell_detail: "",
                    sell_connect: "",
                    sell_press: "",
                    sell_class: "",
                    tip: "",
                    files: [],
                    images_fileID: []
                  })
                  wx.showToast({
                    title: '发布成功',
                    mask: true
                  })
                },
                fail: err => {
                  wx.hideLoading();
                  wx.showToast({
                    icon: 'none',
                    title: '发布失败'
                  })
                }
              })
            }
          },
          fail: err => {
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              icon: "none",
              duration: 2000
            })
          }
        })
      }
    }
  },

  //form获取发布求购信息
  getsubmit01: function(e) {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.showToast({
            title: '请在"个人中心页面"授权',
            icon: "none",
            duration: 2500
          })
        } else {
          var get = this.data;
          if (get.need_title.length == 0) {
            wx.showToast({
              title: '宝贝名不能为空！',
              icon: "none",
              duration: 2000
            })
          } else if (get.need_connect.length == 0) {
            wx.showToast({
              title: '联系方式不能为空！',
              icon: "none",
              duration: 2000
            })
          } else {
            var avatarUrl = null
            if (app.globalData.userInfo) {
              avatarUrl = app.globalData.userInfo.avatarUrl
            }
            var that = this;
            const db = wx.cloud.database()
            db.collection('need-product').add({
              data: {
                need_title: get.need_title,
                need_detail: get.need_detail,
                need_connect: get.need_connect,
                need_shelve: get.need_shelve,
                need_live: get.need_live,
                need_time: db.serverDate(),
                need_url: avatarUrl
              },
              success: res => {
                // 在返回结果中会包含新创建的记录的 _id
                this.setData({
                  counterId: res._id,
                  need_title: "",
                  need_detail: "",
                  need_connect: "",
                })
                that.onLoad();
                wx.showToast({
                  title: '发布成功',
                  mask: true
                })
              },
              fail: err => {
                wx.showToast({
                  icon: 'none',
                  title: '发布失败'
                })
              }
            })
          }
        }
      }
    })

  },
})