//app.js
App({
  onLaunch: function() {

    if (!wx.cloud) {} else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'xust-second-w7q6y',
        traceUser: true,
      })
    }
    // this.getopenid()
    // this.globalData = {
    // }
    this.onGetOpenid()
    this.ongetuserInfo()
  },

  globalData: {},

  onGetOpenid: function() {
    var that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        that.globalData.openid = res.result.openid;
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '获取 openid 失败',
        })
      }
    })

  },
  ongetuserInfo: function() {
    var that = this
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              console.log(res.userInfo)
              that.globalData.userInfo = res.userInfo
            }
          })
        }
      }
    })
  }


})