<template>
    <view>
        <image :src="imageSrc" class="image-card" />
    </view>
</template>

<script>
    export default {
        data() {
            return {
                imageArray: [
                    { id: 1, src: '../../static/shipping1.jpg' },
                    { id: 2, src: '../../static/shipping2.jpg' }
                ],
                imageSrc: '',
                localId: null
            };
        },
        props: ['id'],
        created() {
            this.localId = this.id; // 将props的id值存储到data中
            console.log('Received id:', this.localId); // 调试输出
            this.imageSrc = this.getImageById(this.localId);
            console.log('Image source:', this.imageSrc); // 调试输出
        },
        methods: {
            getImageById(id) {
                const image = this.imageArray.find(item => item.id === parseInt(id));
                return image ? image.src : '';
            }
        }
    }
</script>

<style scoped>
    .image-card {
        margin-top: 20px;
        width: 70%;
        height: auto;
        border-radius: 5px;
    }
</style>
