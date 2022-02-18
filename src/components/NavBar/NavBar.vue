<template>
  <view class="nav-bar">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="header" :style="{ height: navHeight + 'px' }"><slot>{{ title }}</slot></view>
  </view>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';


defineProps<{
  title?: string;
}>();

const { state } = useStore();
const { statusBarHeight, navHeight } = state;
</script>

<style lang="scss" scoped>
.nav-bar {
  background-color: rgba($color: $bgColor, $alpha: 0.9);
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36rpx;
  }
}
</style>
