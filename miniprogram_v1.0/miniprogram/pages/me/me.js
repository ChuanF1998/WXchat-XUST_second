
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: '',
    name: ''
  },
  
  // 跳到正在发布二手页面
  ispublish:function(e){
    wx.navigateTo({
      url: '/pages/ispublish/ispublish',
    })
  },

// 跳转到历史发布二手页面
  waspublish: function (e) {
    wx.navigateTo({
      url: '/pages/waspublish/waspublish',
    })
  },

isneed:function(e){
  wx.navigateTo({
    url: '/pages/isneed/isneed',
  })
},

wasneed:function(e){
  wx.navigateTo({
    url: '/pages/wasneed/wasneed',
  })
},
  // 跳转到反馈界面
  tofeedback:function(e){
    wx.navigateTo({
      url: '/pages/feedback/feedback',
    })
  },

  interesting:function(e){
    wx.navigateTo({
      url: '/pages/ispublishing/ispublishing',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
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


})