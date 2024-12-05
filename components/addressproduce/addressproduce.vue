<template>
	<view class="addressContent">
		<!-- 地址生成盒子 -->
		<view class="card-container">
			<view class="left-top-box">

				<view class="nickNameBox">
					<text>昵称：</text>
					<text v-text="nickName"></text>
				</view>

				<view class="phoneBox">
					<text>号码：</text>
					<text v-text="phoneNumber"></text>
				</view>

				<view class="addressBox">
					<view>
						<text>地址：</text>
						<text v-text="addressContent"></text>
					</view>
				</view>

			</view>

			<!-- 提示 -->
			<view class="tipstext">
				<!-- <text v-text="tipscontext"></text> -->
				<text style="color: #939393; ">温馨提示：将文字复制到<text
						style="color: #eab63c;">拼多多、淘宝</text>等平台的添加收获地址页面可以自动识别并粘贴哦～</text>
			</view>

			<!-- 按钮 -->
			<view class="left-bottom-box">
				<button @click="generateAddress" class="shipping-button">马上生成</button>
				<button @click="copyAddressData" class="shipping-button">复制</button>
				<!-- <button @click="reviseData" class="shipping-button">修改昵称</button> -->

			</view>
		</view>

		<!-- 遮罩层 -->
		<view v-show="nickNamepopupBol" @click="PopupCancel" class="popupBox"></view>
		<!-- 选择昵称弹框 -->
		<view v-show="nickNamepopupBol" class="nickNamepopup">
			<text>获取昵称</text>
			<input type="nickname" name="nickname" placeholder="请输入或选择昵称" @change="getNickname" />
			<view class="popupBottom">
				<button @click="PopupCancel">取消</button>
				<button @click="PopupOk">确认</button>
			</view>
		</view>




	</view>
</template>

<script>
	export default {
		data() {
			return {
				nickName: '', //昵称
				phoneNumber: '', //手机号
				addressContent: '', //地址
				CopyContent: '', //复制内容
				nickNamepopupBol: false, //控制昵称输入框隐藏显示
				tipscontext: '', //提示文本


			};
		},
		// mounted() {
		// 	console.log('加载中....')
		// 	this.getNoticeList();

		// },
		methods: {

			// // 插入字符串
			// insertTextStr(){
			// 	return soure.slice(0, start) + newStr + soure.slice(start)
			// }

			async getNoticeList() {
				console.log('提示文本');
				const notics = uniCloud.importObject('other');
				try {
					const res = await notics.getGenerateAddressTip();
					console.log('提示文本', res);
					if (res.status === 0 && res.describe == "success") {
						// let index1 = res.data.indexOf('拼')-1;
						// let index2 = res.data.lastIndexOf('宝')+1;
						// // let str = res.data.join();
						// console.log(index1,index2)
						this.tipscontext = '温馨提示：' + res.data;
					}
				} catch (e) {
					console.log(e.errMsg);
				}
			},

			// 生成地址按钮事件
			generateAddress() {
				this.nickNamepopupBol = true;

				// const nickName = wx.getStorageSync('nickName');
				// console.log('昵称名', nickName);
				// if (nickName) {
				// this.nickNamepopupBol = false;
				// this.getAddress();
				// }
				// } else {
				// this.nickNamepopupBol = true;
				// }

			},

			// 复制地址
			copyAddressData() {
				uni.setClipboardData({
					data: this.CopyContent,
					success() {
						console.log('复制成功');

					}
				})
			},

			// 封装的公共方法生成地址
			getAddress() {
				// 搜索获取授权时存储在本地的手机号
				// const storedPhoneNumber = wx.getStorageSync('phoneNumber');
				const certificate = wx.getStorageSync('certificate'); //获取凭证
				console.log('certificate----', certificate);

				if (certificate) {
					// 本地存储昵称
					// if (this.nickName != '') {
					// 	wx.setStorageSync('nickName', this.nickName);
					// }
					// const nickName = wx.getStorageSync('nickName');
					const nickName = this.nickName;

					uniCloud.callFunction({
						name: 'getPhone',
						data: {
							certificate: certificate
						}
					}).then(res => {
						if (res.result.status == 0 && res.result.data) {
							this.phoneNumber = res.result.data.phoneNumber; //设置手机号
							// console.log('获取手机号', res.result.data.phoneNumber);
							let userNmae = nickName ? nickName : '默认昵称';
							const addressData = ' 广东省佛山市顺德区顺德职业技术学院蜂创校园服务中心';
							// 将手机号与地址拼接在一起
							let address = userNmae + ' ' + this.phoneNumber + addressData;
							this.CopyContent = address; //复制内容
							this.nickName = userNmae; //昵称
							this.addressContent = addressData; //地址
							// console.log('地址====', this.CopyContent, address);
						}
					}).catch(err => {
						console.log('获取手机号错误', err);
					});

					console.log('昵称---', nickName);




				} else {
					// 处理未获取到手机号的情况
					console.log('未获取到手机号');

					uni.showToast({
						title: '未授权，请先到首页授权',
						icon: 'none'
					})
				}
				this.nickNamepopupBol = false;
			},

			// 点击输入框获取到昵称
			getNickname(e) {
				this.nickName = e.detail.value;
			},

			// 取消昵称
			PopupCancel() {
				this.nickNamepopupBol = false;
			},

			// 确认昵称
			PopupOk(e) {
				console.log('昵称名' + e);
				if (this.nickName) {
					this.getAddress();

				} else {
					uni.showToast({
						title: '请选择或输入昵称',
						icon: 'none'
					})
				}
			},



		}
	}
</script>

<style lang="less">
	.addressContent {
		height: 100vh;
		background-color: #F9F9F9FF;
	}

	// 地址生成盒子
	.card-container {
		width: 100%;
		// display: flex;

		.tipstext {
			display: flex;
			// align-items: center;
			margin: 0 20rpx;
			// background-color: #d0ebe1;
			border-radius: 10rpx;
			padding-left: 10rpx;

			text {
				font-size: 28rpx;
				color: #000;
			}
		}

		.left-top-box {
			padding: 20rpx;
			font-size: 30rpx;
			// background-color:#000;

			.nickNameBox,
			.phoneBox,
			.addressBox {
				display: flex;
				align-items: center;
				margin-bottom: 20rpx;
				padding: 0 30rpx;
				height: 118rpx;
				background-color: #fff;
				border-radius: 8rpx;
				line-height: 118rpx;
				color: #898888FF;

				text:nth-child(1) {
					color: #000;
					font-weight: 700;
				}
			}

			.addressBox {
				view {
					padding: 5rpx 0;
					line-height: 51rpx;
				}
			}


		}

		.left-bottom-box {
			padding: 20rpx;
			display: flex;
			justify-content: space-between;


			.shipping-button {
				margin: 20rpx;
				flex: 1;
				border-radius: 0;
				border: 0;
				font-size: 28rpx;
				color: #fff;
				border-radius: 15rpx;
				height: 70rpx;
				line-height: 70rpx;
				background-color: #248edf;
			}

		}
	}

	.popupBox {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: #000;
		opacity: 0.5;




	}

	// 获取昵称弹框
	.nickNamepopup {
		opacity: 1;
		position: fixed;
		left: 50%;
		top: 30%;
		transform: translateX(-50%);
		padding: 20rpx;
		width: 80%;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		background-color: #f4f4f4;
		border-radius: 15rpx;
		z-index: 100;
		padding: 50rpx;
		height: 240rpx;
		justify-content: space-between;

		text {
			margin-left: 10rpx;
			font-size: 30rpx;
			font-weight: 700;
		}

		input {
			padding-left: 10rpx;
			overflow: hidden;
			height: 70rpx;
			border-radius: 10rpx;
			font-size: 28rpx;
			background-color: #fff;
			line-height: 70rpx;
		}

		.popupBottom {
			margin-top: 20rpx;
			display: flex;

			button {
				border-radius: 0;
				border: 0;
				flex: 1;
				font-size: 28rpx;
				color: #fff;
				border-radius: 15rpx;

				&:nth-child(1) {
					background-color: #f55236;
				}

				&:nth-child(2) {
					margin-left: 20rpx;
					background-color: #289bf3;
				}

				&:nth-child(1):active {
					background-color: #e74b32;
					box-shadow: #000 -1rpx -1rpx 2rpx;
				}

				&:nth-child(2):active {
					background-color: #248edf;
					box-shadow: #000 -1rpx -1rpx 2rpx;
				}
			}

		}
	}
</style>