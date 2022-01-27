<template>
  <view class="panel">
    <view class="mask" v-if="visible" @click="handleToggle"></view>
    <view class="container" :class="{ visible }">
      <slot></slot>
    </view>
    <view class="button" :class="{ visible }" :style="{ color: state.color }" @click="handleToggle">
      <transition name="fade">
        <text class="iconfont icon-close" v-if="visible"></text>
        <text class="iconfont icon-pen" v-else></text>
      </transition>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useStore } from 'vuex';

const { state } = useStore();

const visible = ref(false);

const handleToggle = () => {
  visible.value = !visible.value;
};
</script>

<style lang="scss" scoped>
$left: 32rpx;
$bottom: 160rpx;

.panel {
  --color: #333;
  color: var(--color);
}

.container {
  padding-bottom: 144rpx;
  position: absolute;
  transition: all 0.4s;
  transform: scale(0.01) translateZ(0);
  transform-origin: 60rpx calc(100% - 60rpx);
  background-color: rgba($bgColor, $alpha: 0.9);
  border-radius: 32rpx;
  z-index: 9999;
  left: $left;
  right: $left;
  bottom: $bottom;
  opacity: 0;
  box-shadow: 0 4rpx 16rpx 0 rgba($bgColor, 0.4);

  &.visible {
    transform: scale(1) translateZ(0);
    opacity: 1;
  }
}

.button {
  position: fixed;
  left: $left + 24rpx;
  bottom: $bottom + 24rpx;
  width: 96rpx;
  height: 96rpx;
  border-radius: 200rpx;
  box-shadow: 0 4rpx 16rpx 0 rgba($bgColor, 0.4);
  background-color: rgba($color: $bgColor, $alpha: 0.9);

  &.visible {
    background-color: transparent;
    box-shadow: none;
    z-index: 99999;
  }

  .iconfont {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 56rpx;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.4s;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
