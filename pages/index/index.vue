<template>
	<view style="height: 100vh;" class="content">
		<!-- 轮播区域 -->
		<view class="top">
			<swiper autoplay circular indicator-dots :interval="2000" :duration="500">
				<swiper-item v-for="(image, index) in images" :key="index" @click="handleImageClick(index)">
					<image :src="image.pictureLink" mode="aspectFill" />
				</swiper-item>
			</swiper>
		</view>

		<!-- 公告 -->
		<view class="noticbox">
			<swiper vertical circular autoplay interval="3000" duration="600">
				<!-- <swiper-item v-for="i in 4">公告：文字内容上下滚动{{i}}</swiper-item> -->
				<swiper-item v-for="itme in noticelist" :key="index">{{itme}}</swiper-item>
			</swiper>
			<image @click="OnsearchExpress" mode="heightFix"
				style="height: 40rpx; background-color: #fff; padding:10rpx;" src="../../static/images/search.png">
			</image>

		</view>

		<!-- 搜索快递 -->
		<!-- 		<view class="searchbox">
			<view class="search-top"> -->
		<!-- <input type="text" placeholder="请输入需要搜索快递单号" /> -->
		<!-- 				<image @click="OnsearchExpress" mode="heightFix" src="../../static/images/search.png"></image>
			</view>

		</view> -->




		<!-- 其他代码保持不变 -->
		<view class="tab-container">

			<!-- 导航标题 -->
			<view class="tab-nav-box">
				<view class="tab-nav">
					<view class="tab-item" :class="{ 'active': active === 0 }" @click="handleTabClick(0)">待取件</view>
					<!-- <view class="tab-item" :class="{ 'active': active === 1 }" @click="handleTabClick(1)">遇到困难</view> -->
					<view class="tab-item" :class="{ 'active': active === 1 }" @click="handleTabClick(1)">新生指引</view>
					<view class="tab-item" :class="{ 'active': active === 2 }" @click="handleTabClick(2)">切换账号</view>
					<!--把active修改成是否等于1,handleTabClick(1); 原来是2 handleTabClick(2)-->
					<view class="tab-underline" :style="{ left: active * 35 + '%' }"></view>
				</view>
			</view>

			<!-- nav标签内容区域 -->
			<view class="tab-content">
				<swiper class="tab-swiper" circular :current="navindex" @change="navSlideOn">

					<swiper-item>
						<!-- 待取件区域 -->
						<view class="tab-pane active">
							<view class="middle">
								<view v-if="status === 'Premission'" class="no-data">
									<image class="no-data-image" src="../../static/images/notdata.png"
										alt="授权才可以查看驿站待取件的快递包裹哦~" />
									<text class="no-data-text">授权才可以查看驿站待取件的快递包裹哦~</text>
									<button class="no-data-button" @getphonenumber="Login"
										open-type="getPhoneNumber">立即授权</button>
								</view>
								<!-- 列表数据状态 -->
								<view v-else-if="status === 'listData'" class="scroll-container">
									<view class="collapse" v-for="item in packageList" :key="item.billCode"
										@click="navigateToDetail(item)">
										<view class="collapse-title">
											<image class="collapse-image" :src="item.expressCompanyIcon" />
											<view class="collapse-text-content">
												<text class="collapse-text-title">{{ item.takeCode }}</text>
												<text class="collapse-text-info">顺职蜂创驿站</text>
												<text class="collapse-text-info">{{ item.updateDate }}</text>
												<text
													class="collapse-text-subtitle">{{ item.expressCompanyCode }}</text>
												<text class="collapse-text-info">{{ item.billCode }}</text>
											</view>
											<text class="collapse-status"
												:class="{'status-waiting': item.wayBillStatus === 1, 'status-signed': item.wayBillStatus === 2, 'status-returned': item.wayBillStatus === 3}">
												{{ item.wayBillStatus === 1 ? '待取件' : item.wayBillStatus === 2 ? '签收出库' : '退件出库' }}
											</text>
										</view>
									</view>
								</view>
								<view v-else-if="status === 'noData'" class="no-data">
									<image class="no-data-image" src="../../static/images/notdata.png" alt="暂无取件数据" />
									<text class="no-data-text">暂无取件数据</text>
								</view>
							</view>
						</view>
					</swiper-item>

					<swiper-item class="newStudentbox">
						<!-- 新生指引区域 -->
						<view class="tab-pane" :class="{ 'active': active === 1 }">
							<!-- 生成地址与寄快递入口盒子 -->
							<view class="addressOrSendEntry">
								<!-- 生成地址 -->
								<view class="addressbox" @click="addressBtenter">
									<image src="../../static/地址生成.png"></image>
									<view class="addressboxData">
										<text>绑定驿站地址</text>
										<button>点击进入</button>
									</view>
								</view>

								<view class="card addressbox" v-for="(item, index) in items" :key="item._id"
									@click="gotointrodetail(item)">
									<div class="card-content">
										<img :src="item.pictureLink" alt="background" class="background-image" />

										<view class="addressboxData">
											<text>{{item.describe}}</text>
											<button>点击进入</button>
										</view>

									</div>
									<button v-show="item.jumpType==1" open-type="contact" class="cusotmerBt"></button>

									<!-- <button v-show="item.describe=='客服答疑'" style="background-color: black;" class="card-content">ffff</button> -->

								</view>


							</view>
						</view>
					</swiper-item>

					<!-- 切换手机 -->
					<swiper-item>
						<view class="switchPhonebox">
							<button id="swphonebt" open-type="getPhoneNumber" @getphonenumber="Login">点击更换</button>
						</view>


					</swiper-item>

				</swiper>

			</view>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				items: [],
				active: 0,
				status: 'listData', // 初始状态为 'Premission'
				packageList: [], // 包裹数据 
				activeNames: [], // 当前展开的项
				images: [], // 从云函数获取的轮播图数据
				phonelist: [{
						lable: '1234****101',
						value: '微信绑定手机号'
					},
					{
						lable: '1234****101',
						value: ''
					},
				],
				authphoneBox: true,
				phoneDataShow: false,
				phoneBox: 'getphone phoneDataIn ',
				phoneNumber: 0,

				// 导航内容
				navContentData: [
					// 待取件
					{
						pickedtype: '0',
						pickedContent: '暂无取件数据'
					},
					// 新生指引
					{
						guidelist: ['绑定驿站地址', '取件指引', '寄件指引', '问题答疑', '更多指引']
					}

				],

				// 第几个导航内容卡片
				navindex: 0,
				noticelist: [],


			};
		},
		onLoad() {
			console.log('页面加载成功。。。');
			this.fetchCarousel(); // 调用获取轮播图数据的方法
			this.getSoredPhoneOnLoad(); //获取凭证
			this.fetchArticles(); //获取文章信息
			this.getNoticeList(); //获取公告信息


		},
		onPullDownRefresh() {
			console.log('刷新被触发')
			this.fetchCarousel(); // 调用获取轮播图数据的方法
			this.getSoredPhoneOnLoad(); //获取凭证
			this.fetchArticles(); //获取文章信息
			uni.stopPullDownRefresh(); //关闭刷新

		},
		onShareAppMessage() {
			return {
				title: '顺手办校园驿站',
				path: '/pages/index/index', // 分享路径，确保路径正确
				imageUrl: 'https://env-00jxgt5r6k5b.normal.cloudstatic.cn/wx7670dd170ec4fad6.png?expire_at=1719149437&er_sign=d10509e14f9ce2f26611d40868fc138b' // 分享的图片 URL
			};
		},
		onShareTimeline() {
			return {
				title: '顺手办校园驿站',
				query: 'path=/pages/index/index', // 分享路径中的参数
				imageUrl: 'https://env-00jxgt5r6k5b.normal.cloudstatic.cn/wx7670dd170ec4fad6.png?expire_at=1719149437&er_sign=d10509e14f9ce2f26611d40868fc138b' // 分享的图片 URL
			};
		},

		methods: {
			formatDate(dateString) {
				// 如果 dateString 是数字，则将其转换为日期对象
				const date = new Date(Number(dateString));

				if (isNaN(date.getTime())) {
					console.error("Invalid dateString:", dateString); // 输出无效日期
					return "Invalid Date"; // 返回默认值以避免 NaN
				}

				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				const hours = String(date.getHours()).padStart(2, '0');
				const minutes = String(date.getMinutes()).padStart(2, '0');
				const seconds = String(date.getSeconds()).padStart(2, '0');
				return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
			},

			async getNoticeList() {
				// let that = this;
				const notics = uniCloud.importObject('other');
				try {
					const res = await notics.getAnnouncement();
					// if(res.)
					if (res.status === 0 && res.describe == "success") {
						// console.log('noticelist111',res.data);
						this.noticelist = res.data;
						// console.log('noticelist222',this.noticelist);
					}
				} catch (e) {
					console.log(e.errMsg);
				}
				// console.log('res----',res);
				// if(res.)
			},

			// 搜索
			OnsearchExpress() {
				uni.navigateTo({
					url: '/pages/searchexpressdata/searchexpressdata'
				})
			},

			// 导航滑动事件
			navSlideOn(e) {
				// this.navindex = index;
				this.navindex = e.detail.current;
				this.active = e.detail.current;
			},
			async fetchCarousel() {
				try {
					const res = await uniCloud.callFunction({
						name: 'getCarousel',
						data: {}
					});
					console.log("Carousel response:", res); // 打印整个响应数据
					if (res.result.status === 0) {
						this.images = res.result.data;
						this.images.forEach((image, index) => {
							console.log(`Image ${index} jumpLink:`, image.jumpLink); // 打印每个图片的jumpLink字段
						});
						console.log("Images:", this.images); // 检查 images 数组的内容
					} else {
						console.error('获取轮播图数据失败:', res.result.describe);
					}
				} catch (error) {
					console.error('调用云函数失败:', error);
				}
			},
			handleImageClick(index) {
				const image = this.images[index];
				console.log(`Clicked image ${index} jumpLink:`, image.jumpLink); // 打印点击的图片的jumpLink字段
				if (image.jumpType === 0 && image.jumpLink) {
					wx.navigateTo({
						url: image.jumpLink
					});
				} else {
					console.log('未定义的跳转类型或无跳转链接');
				}
			},
			bindViewTap() {
				wx.navigateTo({
					url: '/pages/demo/demo?url=${}'
				})
			},
			async fetchArticles() {
				try {
					const res = await uniCloud.callFunction({
						name: 'getGuidelines',
						data: {}
					});
					console.log('文章----', res);
					if (res.result.status === 0) {
						let arr = [];
						let obj = {};
						res.result.data.map(x => {
							if (x.describe != '更多指引') {
								arr.push(x);
							} else {
								obj = x;
							}
						});
						arr.push(obj);
						this.items = arr;
						// console.log('arr--',arr);
						// this.items = res.result.data;
					} else {
						console.error('获取文章信息失败:', res.result.describe);
					}
				} catch (error) {
					console.error('调用云函数失败:', error);
				}
			},
			addressBtenter() {
				wx.navigateTo({
					url: '/pages/addressproduce/addressproduce'
				});
			},
			gotoshipping() {
				wx.navigateTo({
					url: '/pages/switchPhone/switchPhone'
				});
			},
			gotointrodetail(item) {
				console.log('item----', item);
				if (item.jumpType != 1) {
					wx.navigateTo({
						url: `/pages/introdetail/introdetail?articleUrl=${item.jumpLink}`
					});

				} 
			},
			handleTabClick(index) {
				this.active = index;
				this.navindex = index;
			},
			getSoredPhoneOnLoad() {
				let that = this;
				const storedPhoneNumber = wx.getStorage({
					key: 'certificate',
					success(res) {
						console.log('获取凭证' + res.data);
						if (res.data) {
							that.sendPhoneNumber(res.data);
						}
					},
					fail() {
						console.log('未获取到');
						that.status = 'Premission';
					}
				});
			},
			navigateToDetail(item) {
				wx.navigateTo({
					url: `/pages/expressdetail/expressdetail?id=${item.billCode}&image=${encodeURIComponent(item.expressCompanyIcon)}&title=${encodeURIComponent(item.takeCode)}&subtitle=${encodeURIComponent(item.expressCompanyCode)}&info=${encodeURIComponent(item.billCode)}&status=${encodeURIComponent(this.getWayBillStatusText(item.wayBillStatus))}`
				});
			},

			toggleCollapse(id) {
				const index = this.activeNames.indexOf(id);
				if (index > -1) {
					this.activeNames.splice(index, 1);
				} else {
					this.activeNames.push(id);
				}
			},

			Login(e) {
				console.log('用户信息:', e);
				console.log('Login invoked, code:', e.detail.code);
				uniCloud.callFunction({
					name: 'getCertificate',
					data: {
						code: e.detail.code
					}
				}).then(res => {
					console.log('凭证res---', res);
					let certificate = res.result.data.certificate;
					console.log('凭证----', certificate);
					if (certificate) {
						this.sendPhoneNumber(certificate);
						wx.setStorage({
							key: 'certificate',
							data: certificate,
							success() {
								console.log('certificate stored successfully');
							}
						});
					}
				}).catch(err => {
					console.error('Failed to get certificate:', err);
				});
			},
			sendPhoneNumber(certificate) {
				console.log('Sending certificate to backend:', certificate);
				uniCloud.callFunction({
					name: 'getCourierInfo',
					data: {
						type: 1, // 假设type为1表示凭证
						data: certificate
					}
				}).then(res => {
					console.log('通过凭证查询res---', res);
					if (res.result.status === 0 && res.result.data.packageInfo.length > 0) {
						this.packageList = res.result.data.packageInfo.map(pkg => ({
							updateDate: this.formatDate(pkg.updateDate), // 格式化时间
							expressCompanyCode: pkg.expressCompanyCode,
							expressCompanyIcon: pkg.expressCompanyIcon,
							wayBillStatus: pkg.wayBillStatus,
							billCode: pkg.billCode,
							takeCode: pkg.takeCode,
						}));
						this.packageList.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate)); // 按时间排序
						this.status = 'listData';
					} else {
						this.status = 'noData';
					}
				}).catch(err => {
					console.error('Failed to get courier info:', err);
				});
			},
			getWayBillStatusText(status) {
				switch (status) {
					case 1:
						return '待取件';
					case 2:
						return '签收出库';
					case 3:
						return '退件出库';
					default:
						return '未知状态';
				}
			},


		}
	};
</script>
<style>
	.noticbox {
		display: flex;
		width: 100%;
		justify-content: center;
		align-items: center;
		background-color: #F9F9F9FF;

	}

	/* 公告 */
	.noticbox swiper {
		margin: 10rpx 0 10rpx 10rpx;
		/* width: 96%; */
		flex: 1;
		height: 60rpx;
		font-size: 28rpx;
		color: #000;
		background-color: #fff;
		border-radius: 10rpx 0 0 10rpx;
		padding-left: 10rpx;
		line-height: 60rpx;


	}

	.noticbox image {
		margin-right: 10rpx;
		border-radius: 0 10rpx 10rpx 0;
	}

	/* 搜索快递 */
	/* 	.searchbox {
		width: 100%;
		display: flex;
		flex-direction: column;
		background-color: #eee;
	} */



	/* 	.searchbox .search-top {
		display: flex;
		align-items: center;
		background-color: #fff;
		border-radius: 10rpx;
		margin: 0 10rpx 10rpx 10rpx;
		height: 60rpx;
	} */

	/* 	.searchbox .search-top input {
		padding-left: 15rpx;
		font-size: 28rpx;
		flex: 1;
		height: 65rpx;
	} */

	.searchbox .search-top image {
		margin: 10rpx 0 10rpx 20rpx;
		height: 35rpx;
	}



	.scroll-container {
		/* padding-top: 30rpx; */
		padding: 30rpx 20rpx 0 20rpx;
		/* height: 600rpx; */
		/* 定义滚动区域的固定高度，可以根据需要调整 */
		overflow-y: scroll;
		/* 启用垂直滚动 */
	}



	.intro {
		max-height: 500rpx;
		/* 定义滚动区域的固定最大高度 */
		overflow-y: auto;
		/* 启用垂直滚动 */
		display: flex;
		flex-direction: column;
		/* 垂直排列卡片 */
		gap: 10px;
		margin-top: 40rpx;
		padding: 10px;
		/* 添加内边距 */
		box-sizing: border-box;
		/* 确保 padding 不影响盒子尺寸 */
	}

	.card {
		margin-top: 32rpx;
		/* position: relative; */
		/* border: 1px solid #ccc; */
		/* padding: 5px; */
		border-radius: 8px;
		/* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); */
		width: 100%;
		/* 占满父容器宽度 */
		height: 223rpx;
		background-color: #fff;
		overflow: hidden;
		/* 确保图片不超出卡片边界 */
	}

	.card-content {
		position: relative;
		width: 100%;
		height: 100%;
		/* 确保内容占满整个卡片 */
	}

	.card:nth-of-type(2) .card-content .addressboxData button {
		background-color: #EB2121FF;
	}

	.card:nth-of-type(3) .card-content .addressboxData button {
		background-color: #2193EBFF;
	}

	.card:nth-of-type(4) .card-content .addressboxData button {
		background-color: #2CDDC5FF;
	}

/* 	.card:nth-of-type(5) .card-content .addressboxData button {
		background-color: #ce73c2;
	} */
	
	.card:nth-of-type(5) .card-content .addressboxData button {
		background-color: #4CA7FFFF;
	}
	
	

	.card:nth-of-type(2) .card-content .addressboxData text {
		color: #8C1919FF;
	}

	.card:nth-of-type(3) .card-content .addressboxData text {
		color: #145181FF;
	}

	.card:nth-of-type(4) .card-content .addressboxData text {
		color: #14816FFF;
	}
	
/* 	.card:nth-of-type(5) .card-content .addressboxData text {
		color: #bf6ab5;
	} */

	.card:nth-of-type(5) .card-content .addressboxData text {
		color: #145181FF;
	}


	.card .cusotmerBt {
		top: 0rpx;
		z-index: 100;
		position: absolute;
		width: 100%;
		height: 100%;
		background-color: #000;
		opacity: 0;
	}


	/* 	.card .card-content .addressboxData text:nth-child(){
		
	} */


	.background-image {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		/* height: 100%; */
		height: 100%;
		object-fit: cover;
		z-index: 1;
		/* 确保图片位于底层 */
	}

	.intro-front {
		position: relative;
		z-index: 2;
		/* 确保文字位于图片上层 */
		color: #000;
		/* 根据需要选择合适的文字颜色 */
		padding: 5px 10px;
		border-radius: 5px;
		text-align: center;
		/* 文字居中 */
		margin: 0;
		/* 移除默认的外边距 */
		font-weight: 400;
		top: 25rpx;
		right: 30rpx;
		color: #2193EBFF;
	}

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		overflow-y: scroll;
		height: 100vh;
		/* 使 content 占满整个视口高度 */
		position: relative;
		/* 为了绝对定位 txt */
		/* background-color: #fff6e4FF; */
	}

	/*  */
	.top {
		position: sticky;
		top: 0%;
		width: 100%;
		z-index: 1000;
		/* background-color: #fff6e4FF; */

	}

	/*  */
	.tab-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		background-color: #F9F9F9FF;
	}

	.tab-nav-box {
		height: 86rpx;
		position: relative;
	}

	.tab-nav {
		position: fixed;
		left: 0;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-bottom: 1px solid #ebedf0;
		z-index: 1000;
		/* 确保导航栏在页面内容之上 */
		background-color: #fff;
		/* 设置背景色 */
	}

	.tab-item {
		flex: 1;
		text-align: center;
		padding: 10px 0;
		font-size: 16px;
		color: #333;
		cursor: pointer;
	}

	.tab-item.active {
		color: #FAAB1DFF;
		font-weight: bold;
	}

	.tab-underline {
		position: absolute;
		bottom: 0;
		left: 0;
		width: 30%;
		height: 2px;
		background-color: #FAAB1DFF;
		transition: left 0.3s;
	}

	.tab-content {
		flex: 1;
		/* overflow: auto; */
		/* padding-bottom: 20rpx */
	}


	.tab-content .tab-swiper {
		height: 100%;
	}

	.tab-content .tab-swiper swiper-item {
		overflow: auto;
	}

	/* 切换手机号 */
	.switchPhonebox #swphonebt {
		margin-top: 40rpx;
		width: 600rpx;
		height: 86rpx;
		background: #FAAB1D;
		border-radius: 50rpx;
		font-weight: 400;
		font-size: 28rpx;
		color: #FFFFFF;
		line-height: 86rpx;
	}

	.tab-pane {
		width: 100%;
		height: 100%;
		/* display: none; */
	}

	/*  */
	.left-bottom-box {

		padding: 10px;

		display: flex;

		justify-content: space-between;
		margin-bottom: 40rpx;

	}

	/*  */
	.tab-pane.active {
		display: block;
	}

	/* 一键生成地址按钮 */
	.tab-pane button:nth-child(1) {
		/* margin-top: 61rpx; */
		width: 90%;
		height: 86rpx;
		line-height: 86rpx;
		background-color: #FAAB1D;
		font-size: 28rpx;
		color: #FEFEFE;
		border-radius: 43rpx;
	}

	/* 复制内容 */
	.tab-pane .adressData {
		position: relative;
		height: 200rpx;
		/* background-color: #dcdcdc; */
		border: 1rpx solid #333;
		border-radius: 30rpx;
		margin: 30rpx;
	}

	.tab-pane .adressData textarea {
		padding: 15rpx;
		width: 100%;
		height: 60rpx;
		box-sizing: border-box;
		background-color: #26ff8b;
		border-radius: 20rpx;
		/* border: 1rpx solid #333; */
		border-radius: 30rpx;
		font-size: 28rpx;
		color: #666;

	}

	.tab-pane .adressData button {
		position: absolute;
		right: 15rpx;
		bottom: 15rpx;
		width: 110rpx;
		height: 60rpx;
		/* box-sizing: border-box; */
		line-height: 60rpx;
		font-size: 25rpx;
		color: #000;
		border: 1rpx solid #666;
		border-radius: 10rpx;
		background-color: #fff;
	}





	/*  */
	.txt {
		position: absolute;
		top: 20px;
		/* 距离顶部的距离 */
		left: 20px;
		/* 距离左边的距离 */
	}

	/* .middle { */
	/* width: 90%; */
	/* 调整 middle 盒子的宽度 */
	/* margin: 20px 5px; */
	/* 设置上下外边距 */
	/* padding: 12px; */
	/* 设置内边距 */
	/* background-color: #fff; */
	/* 设置背景色 */
	/* border-radius: 10px; */
	/* 设置圆角 */
	/* box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); */
	/* 设置阴影 */
	/* } */

	.shipping-button {

		width: 30%;
		/* Adjust the width as needed */
		height: 86rpx;
		background-color: #FAAB1D;
		/* Change the background color if needed */
		font-size: 28rpx;
		color: #FEFEFE;
		border-radius: 43rpx;
		margin-right: 10px;
		/* Add margin between buttons if needed */
		line-height: 86rpx;
	}

	.no-data {
		position: relative;
	}

	.no-data,
	.no-packages {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	.no-packages-image {
		width: 100px;
		height: 100px;
		margin-bottom: 10px;
	}

	.no-packages-text {
		font-size: 16px;
		color: #666;
	}

	.no-data-image {
		width: 491.85rpx;
		height: 504.06rpx;
	}

	.no-data-text {
		position: absolute;
		top: 424rpx;
		text-align: center;
		color: #9C9C9CFF;
		font-size: 28rpx;
	}

	.no-data-button {
		width: 235rpx;
		height: 68rpx;
		/* margin-top: 11rpx; */
		/* 		padding: 10px 20px; */
		background-color: #ffa500;
		color: white;
		border: none;
		border-radius: 50px;
		cursor: pointer;
		font-size: 28rpx;
		line-height: 68rpx;
	}

	.collapse {
		margin-bottom: 20rpx;
		width: 100%;


	}

	.collapse-title {
		display: flex;
		align-items: center;
		padding: 10px;
		background-color: #fff;
		/* border: 1px solid #dcdcdc; */
		cursor: pointer;
		/* border-radius: 10px; */
		/* 设置圆角 */
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		/* border-radius: 25rpx; */
		border-radius: 8rpx;
	}

	.collapse-image {
		width: 160rpx;
		height: 105rpx;
		margin-right: 31rpx;
		/* object-fit: cover; */
	}

	.collapse-text-content {
		flex-grow: 1;
		display: flex;
		flex-direction: column;
	}

	.collapse-text-title {
		font-size: 36rpx;
		font-weight: bold;
		color: #1E1E1E;
	}

	.collapse-text-subtitle {
		font-size: 22rpx;
		color: #9E9E9EFF;

	}

	.collapse-text-info {
		font-size: 24rpx;
		color: #1E1E1EFF;


	}

	.collapse-status {
		font-size: 28rpx;
		color: #A1A1A1FF;
		margin-left: 58rpx;
	}

	.collapse-content {
		padding: 10px;
		background-color: #fafafa;
		border: 1px solid #dcdcdc;
		border-top: none;
	}

	.swiper {
		width: 100%;
		height: 100%;
		border-radius: 10px;
		overflow: hidden;


	}

	.swiper-item {
		height: 100%;
		display: flex;
		justify-content: center;
		padding: 0 20px;

	}

	image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		/* border-radius: 10px; */

	}

	/*  */
	.left-top-box {
		display: flex;
	}

	/* 生成地址与寄快递入口盒子  */
	.addressOrSendEntry {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		padding: 45rpx 25rpx;
		box-sizing: border-box;
		/* height: 900rpx; */
		/* 固定高度 */
		/* overflow-y: auto; */
		/* 启用垂直滚动 */
	}

	/* 寄快递入口 */
	.addressOrSendEntry .addressbox,
	/* 生成地址入口 */
	.addressOrSendEntry .sendbox {
		position: relative;
		/* margin-top: 32rpx; */
		width: 702rpx;
		height: 223rpx;
	}

	.addressOrSendEntry .sendbox {
		margin-top: 32rpx;
	}

	.addressOrSendEntry .addressbox .addressboxData,
	.addressOrSendEntry .sendbox .sendboxData {
		position: absolute;
		z-index: 100;
		top: 63rpx;
		left: 69rpx;
	}

	.addressOrSendEntry .addressbox .addressboxData text,
	.addressOrSendEntry .sendbox .sendboxData text {
		font-size: 36rpx;
		font-weight: 700;


	}

	.addressOrSendEntry .addressbox .addressboxData button,
	.addressOrSendEntry .sendbox .sendboxData button {
		margin: 0;
		padding: 0;
		margin-top: 22rpx;
		width: 143rpx;
		height: 40rpx;
		font-size: 24rpx;
		border-radius: 25rpx;
		background-color: #FAAB1DFF;
		line-height: 40rpx;
		color: #fff;
	}


	.addressOrSendEntry .addressbox .addressboxData text {
		color: #523B11FF;
	}

	.addressOrSendEntry .sendbox .sendboxData text {
		color: #145181FF;
	}

	.addressOrSendEntry .addressbox .addressboxData button {
		background-color: #FAAB1DFF;
	}

	.addressOrSendEntry .sendbox .sendboxData button {
		background-color: #2193EBFF;

	}
</style>