<template>
  <view class="top">
    <CanvasVideo :path="state.path" :background="getters.backgroundColor"></CanvasVideo>
  </view>
  <view class="list">
    <view class="item"></view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { shareConfig } from '@/commons/config';
import { useGenerateImage } from '@/uses/useGenerateImage';
import { useStore } from 'vuex';

// 分享
onShareAppMessage(() => shareConfig);
// 分享朋友圈
onShareTimeline(() => shareConfig);

const { state, getters } = useStore();
</script>

<style lang="scss" scoped>
.top {
  height: 520rpx;
}
</style>
