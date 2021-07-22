Page({

    /**
     * 页面的初始数据
     */
    data: {
        imgUrls: [
            'http://p1.music.126.net/XyOsH9i6nO3tyiV4xzTzEA==/109951164218412778.jpg',
            'http://p1.music.126.net/f5KCVtAf1JOgKMtgPQZy4A==/109951164218427420.jpg',
            'http://p1.music.126.net/kf7c_L6sEFJvywB9QrdIhQ==/109951164218484097.jpg'
          ],
        // 歌曲数组
        songs: null,
        // 歌曲封面数组存储歌曲列表的封面
        albumPicUrls: null,
        // 搜索的关键字
        KeyWord: null,
        // 默认搜索条数
        defaultLimit: 10,
        // 搜索的条数
        limit: 10,
        // 所有的歌曲id
        ids: null
    },

    /**
     * 监听播放按钮点击
     */
    gotoPlay: function (e) {
        // 接收页面通过事件传递的当前歌曲id参数
        var id = e.currentTarget.dataset.id;
        wx.navigateTo({
            // 携带参数跳转播放页面路径
            url: "/pages/play/play?musicId=" + id + "&ids=" + this.data.ids,
        });
    },

    /**
     * 获取输入的关键字
     */
    getKeyWord: function (e) {
        // 获取输入框中的内容
        var value = e.detail.value;
        console.log(value);
        // 给data中的关键字赋值
        this.setData({
            KeyWord: value,
            limit: this.data.defaultLimit
        });
    },

    /**
     * 点击搜索按钮时触发的方法
     */
    doSearch: function () {
        // 获取关键字
        var KeyWord = this.data.KeyWord;
        var that = this;
        // 处理空格
        var pattern = /\s+/;
        if (KeyWord != null && KeyWord.replace(pattern,"").length > 0) {
            //显示提示框
            wx.showLoading({
                title: "加载中，请稍后...",
            });
            // 根据关键字搜索歌曲(发请求)
            wx.request({
                url: "https://music.163.com/api/search/get?s=" + KeyWord + "&type=1&limit=" + that.data.limit,
                success: function (res) {
                    // 搜索解析之后的结果
                    var resultSongs = res.data.result.songs;
                    console.log("-----------------------------------------------")
                    console.log(resultSongs)
                    console.log(resultSongs[0].artists[0].img1v1Url)

                    // songs没有专辑封面
                    that.setData({
                        songs: resultSongs
                    })
                    var searchIds = [];
                    // 遍历resultSongs,获取所有的歌曲id，并存放到数组中
                    for (var i = 0; i < resultSongs.length; i++) {
                        searchIds.push(resultSongs[i].id)
                    }
                    that.setData({
                        albumPicUrls: [],
                        ids: searchIds
                    })
                    // 专辑封面通过id访问歌曲详情接口获取
                    that.getMusicImageById(searchIds, 0, searchIds.length);
                },
                // 接口调用失败的回调函数
                fail: function () {

                },
                // 接口调用结束的回调函数（调用成功、失败都会执行）
                complete: function () {
                    // 隐藏loading提示框
                    wx.hideLoading();
                },
            });
        }
    },

    /**
     * 根据歌曲id获取歌曲封面 searchIds:搜索出来的存放所有id的数组
     * tip：不要在for循环写异步请求，返回的结果顺序不一定跟请求顺序保持一致
     *       可以使用递归解决
     * 递归(直接或者间接的调用自己)
     *     从哪儿开始，到哪儿结束
     */
    getMusicImageById: function (searchIds, i, length) {
        //根据传递的下标获取id
        var id = searchIds[i];
        var that = this;
        //使用全局变量存储封面
        var albumPicUrls = this.data.albumPicUrls;
        //根据id发请求
        wx.request({
            url: "https://music.163.com/api/song/detail/?id=" + id + "&ids=[" + id + "]",
            success: function (res) {
                //获取当前歌曲的封面
                var picUrl = res.data.songs[0].album.picUrl;
                //将封面存储到albumPicUrls
                albumPicUrls.push(picUrl);
                that.setData({
                    albumPicUrls: albumPicUrls
                });
                // 递归调用 加条件限制
                if (++i < length) {
                    that.getMusicImageById(searchIds, i, length)
                }
            }
        })
    },

    /**
     * mv图标被点击的函数
     */
    gotoMv: function (e) {
        //接收mvid
        var mvid = e.currentTarget.dataset.mvid;
        //跳转到mv播放页面
        wx.navigateTo({
            url: "/pages/mv/mv?mvid=" + mvid,
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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
        wx.showToast({
            title: "刷新成功",
            icon: "success",
            duration: 1000
        });
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        // 修改查询的条数
        this.setData({
            limit: this.data.limit + this.data.defaultLimit
        });
        // 调用搜索歌曲方法
        this.doSearch();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})