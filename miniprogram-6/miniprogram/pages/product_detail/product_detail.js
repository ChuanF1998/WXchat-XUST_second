Page({

  /**
   * 页面的初始数据
   */
  data: {
    result:[]
  },

  //图片点击事件
  img: function (event) {
    let arr=[];
    arr.push(this.data.result[0].images_fileID);
    var src = event.currentTarget.dataset.src;//获取data-src
    // var imgList = that.data.result.images_fileID;
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: arr[0]// 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
   var id=options.product_id;
    const db = wx.cloud.database();
    db.collection('second-product').where({
      _id: id
    }).get({
      //如果查询成功的话    
      success: res => {
        var time= res.data[0].sell_time.toLocaleDateString()
        res.data[0].sell_time=time;
        that.setData({
          result:res.data
        })
        
      }
     
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})