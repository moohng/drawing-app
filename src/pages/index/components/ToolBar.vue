<template>
  <!-- 操作区域 -->
  <view class="toolbar bg-blur" :style="{ backgroundColor: store.themeColor }">
    <button class="button" @click="handleShare"><text class="iconfont icon-share"></text></button>
  </view>
</template>

<script setup lang="ts">
import { useStore } from '@/store';

const store = useStore();

/** 操作 */
const handleShare = () => {
  if (store.currentPathIndex < 0) {
    return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
  }

  uni.navigateTo({ url: '/pages/share/index' });
};
</script>

<style lang="scss" scoped>
.toolbar {
  // padding: 0 16rpx;
  display: flex;
  justify-content: space-around;
  background-color: rgba($bgColor, 0.9);
  border-radius: 200rpx;
  box-shadow: $shadow;
}

.toolbar .button {
  margin: 0;
  width: 96rpx;
  height: 96rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: currentColor;
  font-weight: normal;
  background-color: transparent;
  line-height: 1;
  border-radius: 0;
  color: #fff;

  &::after {
    border: none;
  }

  // #ifndef MP
  &:active,
  // #endif
  &.button-hover {
    background-color: rgba($bgColorHover, 0.6);
  }

  .iconfont {
    font-size: 56rpx;
  }
}
</style>
