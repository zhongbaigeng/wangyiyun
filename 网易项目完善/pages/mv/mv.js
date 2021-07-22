Page({

    /**
     * 页面的初始数据
     */
    data: {
        //当前mvid
        mvid: 0,
        //mv简要描述
        mvBriefDesc: "",
        //详细描述
        mvDesc: "",
        //mv地址
        mvAddress: ""
    },

    /**
     * 根据mvid获取mv地址
     */
    getMvById: function () {
        //获取mvid
        var mvid = this.data.mvid;
        var that = this;
        wx.request({
            url: "https://music.163.com/api/mv/detail?id=" + mvid + "&type=mp4",
            success: function (res) {
                // 请求结果
                console.log(res)
                // 解析存放mv地址和简称描述等信息的对象
                var mvObj = res.data.data;
                console.log('=====================================')
                console.log(mvObj)
                // 获取简要描述
                var briefDesc = mvObj.briefDesc;
                // 获取详细描述
                var desc = mvObj.desc;
                //获取mv的地址（默认最高清晰度）
                var mvAddress = "";
                if (mvObj.brs[1080]) {
                    mvAddress = mvObj.brs[1080];
                } else if (mvObj.brs[720]) {
                    mvAddress = mvObj.brs[720];
                } else if (mvObj.brs[480]) {
                    mvAddress = mvObj.brs[480];
                } else if (mvObj.brs[240]) {
                    mvAddress = mvObj.brs[240];
                }
                that.setData({
                    mvBriefDesc: briefDesc,
                    mvDesc: desc,
                    mvAddress: mvAddress
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var mvid = options.mvid;
        this.setData({
            mvid: mvid
        });
        //调用获取mv的方法
        this.getMvById();
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
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})