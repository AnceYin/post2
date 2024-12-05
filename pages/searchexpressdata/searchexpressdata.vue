<template>
	<view class="content-box">
		<view class="searchbox">
			<view class="search-top">
				<input v-model="expressnumber" type="text" placeholder="请输入快递订单号查询"/>
				<image @click="onSearchExpressData" mode="heightFix" src="../../static/images/search.png"></image>
			</view>
			<view v-if="searchBol" class="search-content">
				<view class="search-item" v-for="item in myexpressData">
					<image :src="item.expressCompanyIcon"></image>
					<view class="item-content">
						<text>{{item.takeCode}}</text>
						<text>蜂创校园服务中心</text>
						<text>{{item.expressCompanyCode}} | {{item.billCode}}</text>
					</view>
					<text v-if="item.wayBillStatus==1" class="text-status">待取件</text>
					<text v-else-if="item.wayBillStatus==2" class="text-status">签收出库</text>
					<text v-else-if="item.wayBillStatus==3" class="text-status">退件出库</text>
					<text v-else="item.wayBillStatus==4" class="text-status">未知状态</text>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

				// 快递单号
				expressnumber: '',

				// 查询状态
				searchBol: false,

				// 快递信息
				myexpressData: [{
						takeCode: 'A3-2-30234',
						expressCompanyCode: 'YZXB',
						billCode: '78420616856546',
						wayBillStatus: 1,
						expressCompanyIcon: '../../static/images/zhongtong.png'
					},
					{
						takeCode: 'A3-2-30234',
						expressCompanyCode: 'YZXB',
						billCode: '78420616856546',
						wayBillStatus: 1,
						expressCompanyIcon: '../../static/images/zhongtong.png'
					}

				]
			};
		},
		methods: {

			// 搜索快递
			onSearchExpressData() {
				if (this.expressnumber) {
					uniCloud.callFunction({
						name: 'getCourierInfo',
						data: {
							type: 2,
							data: this.expressnumber
						}
					}).then(res => {
						// console.log('res----', res);
						if (res.result.status === 0 && res.result.data.packageInfo.length > 0) {
							// console.log('查询到了---');
							this.myexpressData = res.result.data.packageInfo;
							this.searchBol = true;
						} else {
							this.myexpressData = [];
							uni.showToast({
								title: '暂未查询到相关快递',
								icon: 'none'
							});
						}

					}).catch(err => {
						console.log('错误---', err);
					})
				} else {
					uni.showToast({
						title: '请输入快递单号',
						icon: 'none'
					});
				}

			}
		}
	}
</script>

<style lang="less">
	.content-box {
		height: 100vh;
		background-color: #eee;
		overflow: auto;

		.searchbox {
			display: flex;
			flex-direction: column;

			.search-top {
				display: flex;
				align-items: center;
				height: 80rpx;
				background-color: #fff;
				border-radius: 10rpx;
				margin: 50rpx 20rpx 30rpx;

				input {
					padding-left: 20rpx;
					font-size: 28rpx;
					flex: 1;
				}

				image {
					margin: 0 30rpx;
					height: 40rpx;
				}

			}

			.search-content {
				padding: 0 24rpx;

				.search-item:nth-child(n) {
					animation: iteman 0.5s ease;
				}

				.search-item:nth-child(2n+1) {
					animation: iteman2 0.5s ease;
				}

				.search-item {
					margin-bottom: 28rpx;
					display: flex;
					align-items: center;
					height: 200rpx;
					background-color: #FFFFFFFF;

					image {
						margin-left: 24rpx;
						margin-right: 30rpx;
						width: 160rpx;
						height: 105rpx;
					}

					.item-content {
						flex: 1;
						display: flex;
						flex-direction: column;
						color: #000000FF;

						text:nth-child(1) {
							font-size: 36rpx;
							font-weight: 700;

						}

						text:nth-child(2) {
							margin-top: 19rpx;
							font-size: 24rpx;

						}

						text:nth-child(3) {
							margin-top: 18rpx;
							font-size: 22rpx;
							color: #898888FF;

						}

					}

					.text-status {
						margin-right: 57rpx;
						color: #9E9E9EFF;
						font-size: 28rpx;
					}


				}

			}


		}
	}


	@keyframes iteman {
		0% {
			transform: translateX(1000px);
		}

		100% {
			transform: translateX(0px);

		}
	}

	@keyframes iteman2 {
		0% {
			transform: translateX(-1000px);
		}

		100% {
			transform: translateX(0px);

		}
	}
</style>