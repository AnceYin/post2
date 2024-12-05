<template>
<!-- 	<view class="introdetail">
		<image v-if="link" :src="link" mode="widthFix" style="width: 100%;"  />
		<text v-else>未找到对应图片</text>
	</view> -->
	
	<web-view :src="articleUrl"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				// id: null,
				// link: ''
				
				articleUrl:''
				
			};
		},
		onLoad(options) {
			// if (options.id && options.link) {
			// 	this.id = options.id;
			// 	this.link = decodeURIComponent(options.link);
			// }
			if (options.articleUrl) {
				this.articleUrl = options.articleUrl;
				// this.link = decodeURIComponent(options.link);
			}
		}
	};
</script>

<style scoped>

</style>