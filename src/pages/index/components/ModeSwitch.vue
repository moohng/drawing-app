<template>
  <view class="mode-switch" :style="{ color: getters.color }">
    <button class="button"><text class="iconfont icon-qiehuan"></text></button>
    <view class="container"></view>
  </view>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';

const { getters } = useStore();
</script>

<style lang="scss" scoped>
.mode-switch {
  position: fixed;
  top: 24rpx;
  right: 32rpx;

  .button {
    margin: 0;
    width: 96rpx;
    height: 56rpx;
    border-radius: 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: currentColor;
    font-weight: normal;
    background-color: rgba($color: $bgColor, $alpha: 0.9);
    box-shadow: $shadow;

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
}
</style>
