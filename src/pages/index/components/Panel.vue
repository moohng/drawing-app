<template>
  <view class="panel">
    <view class="mask" v-if="visible" @touchend="handleToggle"></view>
    <view class="container" :class="{ visible }">
      <slot></slot>
    </view>
    <view class="button" :class="{ visible }" :style="{ color: getters.color }" @click="handleToggle">
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

const { getters } = useStore();

const visible = ref(false);

const handleToggle = () => {
  visible.value = !visible.value;
};
</script>

<style lang="scss" scoped>
.panel {
  position: relative;
  margin-right: 24rpx;
  --color: #333;
  color: var(--color);
}

.container {
  position: absolute;
  transition: all 0.3s;
  transform: scale(0) translateZ(0);
  transform-origin: 40rpx calc(100% + 80rpx);
  background-color: rgba($bgColor, $alpha: 0.9);
  border-radius: 32rpx;
  z-index: 9999;
  left: 0;
  bottom: 120rpx;
  width: 750rpx - 32rpx * 2;
  opacity: 0;
  box-shadow: $shadow;

  &.visible {
    transform: scale(1) translateZ(0);
    opacity: 1;
  }
}

.button {
  position: relative;
  width: 96rpx;
  height: 96rpx;
  border-radius: 200rpx;
  box-shadow: $shadow;
  background-color: rgba($color: $bgColor, $alpha: 0.9);

  &.visible {
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
