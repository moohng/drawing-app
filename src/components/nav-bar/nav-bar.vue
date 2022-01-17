<template>
  <view class="nav-bar" :style="{height: navHeight + statusBarHeight + 'px'}">
    <view class="fixed inset-x-0 top-0">
      <view :style="{height: statusBarHeight + 'px'}"></view>
      <view class="flex items-center justify-between px-24rpx" :style="{height: navHeight + 'px'}">
        <view v-if="showBack">返回</view>
        <view class="absolute center font-bold text-lg">title</view>
        <view class="ml-auto">
          <slot name="right"></slot>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
const { statusBarHeight = 20 } = uni.getSystemInfoSync();
let navHeight = 44;
// #ifdef MP-WEIXIN
const { top, bottom, height } = uni.getMenuButtonBoundingClientRect();
navHeight = (bottom + top) - 2 * statusBarHeight;
// #endif
// #ifndef MP-WEIXIN
// const navHeight = 44;
// #endif

const showBack = getCurrentPages().length > 1;
</script>

<style>
.status-bar {
  padding-top: var(--status-bar-height);
}

.center {
  left: 50%;
  transform: translateX(-50%);
}
</style>
