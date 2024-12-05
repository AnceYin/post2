<template>
    <view class="image-container">
        <view class="pic" @click="navigateToMiniProgram('wxb269b8326b8f7c9a')">
            <image src="/static/images/ji1.jpg" mode="widthFix" class="image" show-menu-by-longpress="true" />
        </view>
        <view class="pic" @click="navigateToMiniProgram('wx6885acbedba59c14')">
            <image src="/static/images/ji2.jpg" mode="widthFix" class="image" show-menu-by-longpress="true" />
        </view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // 数据属性，如果有需要可以在此添加
        };
    },
    methods: {
        navigateToMiniProgram(appId) {
            wx.navigateToMiniProgram({
                appId: appId,
                path: '', // 如果需要指定小程序的页面路径，可以在这里添加
                extraData: {
                    // 需要传递给目标小程序的数据
                },
                envVersion: 'release', // 可以是 'release'、'develop' 或 'trial'
                success(res) {
                    console.log('跳转成功', res);
                },
                fail(err) {
                    console.error('跳转失败', err);
                }
            });
        }
    }
};
</script>

<style scoped>
.image-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 20px;
}

.pic {
    margin: 10px;
    width: 80%;
    border: 1px solid #ddd;
    border-radius: 5px;
    overflow: hidden;
}

.image {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
}
</style>
