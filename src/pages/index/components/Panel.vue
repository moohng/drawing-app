<template>
  <view class="panel">
    <view class="mask" v-if="visible"></view>
    <view class="container" :class="{ hidden: !visible }">
      <slot></slot>
    </view>
    <view class="bar" :style="{ color: getters.color }">
      <view class="button" @click="handleToggle">
        <transition name="fade">
          <text class="iconfont icon-close" v-if="visible"></text>
          <text class="iconfont icon-pen" v-else></text>
        </transition>
      </view>
      <view class="button" :class="{ active: isActive }" @click="handleSwitch"><text class="iconfont icon-cachu"></text></view>
      <view class="button" @click="handleUndo" @longpress="handleClear"><text class="iconfont icon-undo"></text></view>
      <view class="button" @click="handleRedo"><text class="iconfont icon-undo redo"></text></view>
      <view class="button" @click="handlePreview"><text class="iconfont icon-play"></text></view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Paint } from '@/commons/Paint';
import { ref } from 'vue';
import { useStore } from 'vuex';
import { usePanelAction } from '../uses/useToolAction';

const props = defineProps<{
  paint?: Paint;
}>();

interface Emits {
  (event: 'preview'): void;
  (event: 'save'): void;
}

const emit = defineEmits<Emits>();

const { getters } = useStore();

const { handleUndo, handleRedo, handleClear, handlePreview } = usePanelAction(emit, props);

const visible = ref(true);
const handleToggle = () => {
  visible.value = !visible.value;
};

const isActive = ref(false);
const handleSwitch = () => {
  isActive.value = !isActive.value;
  props.paint!.ctx.globalCompositeOperation = isActive.value ? 'destination-out' : 'source-over';
};
</script>

<style lang="scss" scoped>
.panel {
  position: relative;
  margin-right: 24rpx;
  --color: #333;
  color: var(--color);

  .mask {
    pointer-events: none;
  }
}

.container {
  position: absolute;
  transition: all 0.3s;
  transform-origin: 40rpx calc(100% + 80rpx);
  background-color: rgba($bgColor, $alpha: 0.9);
  border-radius: 32rpx;
  z-index: 9999;
  left: 0;
  bottom: 120rpx;
  width: 750rpx - 32rpx * 2;
  box-shadow: $shadow;

  &.hidden {
    transform: scale(0) translateZ(0);
    opacity: 0;
  }
}

.bar {
  padding: 0 16rpx;
  display: flex;
  justify-content: space-between;
  border-radius: 200rpx;
  box-shadow: $shadow;
  background-color: rgba($color: $bgColor, $alpha: 0.9);
}

.button {
  position: relative;
  width: 96rpx;
  height: 96rpx;

  &.active {
    position: relative;
    background-color: #fff;
    &::before {
      display: inline-block;
      content: '';
      position: absolute;
      top: -10rpx;
      right: -10rpx;
      border: 14rpx solid transparent;
      border-bottom-color: currentColor;
      transform: rotate(45deg);
    }
  }

  .iconfont {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    font-size: 56rpx;
    &.redo {
      transform: translate(-50%, -50%) rotateY(180deg);
    }
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
