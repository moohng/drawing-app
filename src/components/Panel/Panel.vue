<template>
  <view class="panel">
    <view class="mask" v-if="visible"></view>
    <view class="container" :class="{ visible }">
      <slot></slot>
    </view>
    <view class="button" :class="{ visible }" :style="{ color: state.color }" @click="handleToggle">
      <transition name="fade" :duration="20000">
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

const visible = ref(true);

const handleToggle = () => {
  visible.value = !visible.value;
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  transition: all .4s;
  transform: scale(0.01) translateZ(0);
  transform-origin: 24px calc(100% - 24px);
  background-color: rgba($color: #dfdfdf, $alpha: 0.6);
  border-radius: 16px;
  z-index: 9999;
  left: 12px;
  right: 12px;
  height: 300px;
  bottom: 60px;

  &.visible {
    transform: scale(1) translateZ(0);
  }
}

.button {
  position: fixed;
  left: 24px;
  bottom: 72px;
  width: 48px;
  height: 48px;
  border-radius: 100px;
  box-shadow: 0 1px 12px 0 rgba(#333, 0.06);
  z-index: 99999;
  // background-color: rgba($color: #dfdfdf, $alpha: 0.6);

  .iconfont {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 26px;
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
