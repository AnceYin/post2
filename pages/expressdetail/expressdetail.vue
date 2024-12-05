<template>
  <view class="container">
    <view v-if="packageInfo" class="package-card">
      <image class="package-image" :src="packageInfo.image" />
      <view class="package-details">
        <text class="package-title">{{ packageInfo.title }}</text>
        <text class="package-subtitle">{{ packageInfo.subtitle=='undefined' ? '':packageInfo.subtitle}}</text>
		<text class="package-subtitle">顺职蜂创驿站</text>
        <text class="package-info">{{ packageInfo.info }}</text>
        <text class="package-status">{{ packageInfo.status }}</text>
      </view>
    </view>
    <view v-else class="loading">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      packageInfo: null
    };
  },
  onLoad(options) {
    // 确保 options 存在并且包含所需的属性
    if (options && options.id && options.image && options.title && options.subtitle && options.info && options.status) {
      const packageInfo = {
        id: options.id,
        image: decodeURIComponent(options.image),
        title: decodeURIComponent(options.title),
        subtitle: decodeURIComponent(options.subtitle),
        info: decodeURIComponent(options.info),
        status: decodeURIComponent(options.status)
      };
      this.packageInfo = packageInfo;
    } else {
      console.error('Missing required parameters:', options);
    }
	
	

  }
};
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.package-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.package-image {
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
}

.package-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.package-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.package-subtitle {
  font-size: 16px;
  color: #666;
  margin-bottom: 10px;
}

.package-info {
  font-size: 14px;
  color: #999;
  margin-bottom: 10px;
}

.package-status {
  font-size: 14px;
  color: #999;
}

.loading {
  font-size: 16px;
  color: #999;
}
</style>
