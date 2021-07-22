//app.js
App({
	onLaunch: function () {
		// 展示本地存储能力
		var logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)
		
		// 校验用户登录态
		wx.checkSession({
			success() {
				//session_key 未过期，并且在本生命周期一直有效
				wx.showToast({
					title: "登录状态有效",
					icon: "success",
					duration: 1000
				})
			},
			fail() {
				// session_key 已经失效，需要重新执行登录流程
				wx.showModal({
					title: "提示",
					content: "登陆状态已失效",
					showCancel: false,
					confirmText: "重新登录",
					success(res) {
						if (res.confirm) {
							wx.showLoading({
								title: '登录中...',
							});
							// 登录
							wx.login({
								success: res => {
									// 发送 res.code 到后台换取 openId, sessionKey, unionId
									// 模拟登录请求后台耗时
									setTimeout(function () {
										wx.request({
											url: "url",
											complete: function () {
												// 登录成功
												wx.showToast({
													title: "登录成功！",
													icon: "success",
													duration: 1000
												});
											}
										})
									}, 2000);
								}
							});
						}
					}
				});
			}
		});

		// 获取用户信息
		wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
					// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
					wx.getUserInfo({
						success: res => {
							// 可以将 res 发送给后台解码出 unionId
							this.globalData.userInfo = res.userInfo

							// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
							// 所以此处加入 callback 以防止这种情况
							if (this.userInfoReadyCallback) {
								this.userInfoReadyCallback(res)
							}
						}
					});
				}
			}
		});
	},
	globalData: {
		userInfo: null
	}
})