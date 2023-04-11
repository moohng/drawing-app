<template>
  <view class="nav-bar">
    <view class="status-bar" :style="{ height: statusBarHeight + 'px' }"></view>
    <view class="header" :style="{ height: navHeight + 'px' }"><slot>{{ title }}</slot></view>
  </view>
</template>

<script lang="ts" setup>
import { useStore } from '@/store';
import { toRefs } from 'vue';


defineProps<{
  title?: string;
}>();

const store = useStore();
const { statusBarHeight, navHeight } = toRefs(store);
</script>

<style lang="scss" scoped>
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background-color: rgba($color: $bgColor, $alpha: 0.9);
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 36rpx;
  }
  z-index: 9;
}
</style>
