<template>
  <view class="panel">
    <view class="container">
      <slot></slot>
    </view>
    <view class="bar" :style="{ '--color': store.themeColor }">
      <view class="button" :class="{ active: paintType === PaintType.PEN }" @click="handleSwitch(PaintType.PEN)">
        <text class="iconfont icon-pen"></text>
      </view>
      <view class="button" :class="{ active: paintType === PaintType.ERASER }" @click="handleSwitch(PaintType.ERASER)"><text class="iconfont icon-cachu"></text></view>
      <view class="button" @click="handleUndo" @longpress="handleClear"><text class="iconfont icon-undo"></text></view>
      <view class="button" @click="handleRedo"><text class="iconfont icon-undo redo"></text></view>
      <view class="button" @click="handlePreview"><text class="iconfont icon-play"></text></view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Paint } from '@/commons/Paint';
import { PaintType, TypeKeys } from '@/store/types';
import { computed } from 'vue';
import { useStore } from '@/store';
import { usePanelAction } from '../uses/useToolAction';

const props = defineProps<{
  paint?: Paint;
}>();

interface Emits {
  (event: 'preview'): void;
  (event: 'save'): void;
}

const emit = defineEmits<Emits>();

const store = useStore();

const { handleUndo, handleRedo, handleClear, handlePreview } = usePanelAction(emit, props);

const paintType = computed(() => store.paintType);

const handleSwitch = (paintType: PaintType) => {
  store.setPaintType(paintType);
};
</script>

<style lang="scss" scoped>
.panel {
  position: relative;
  margin-right: 24rpx;
  color: #333;
}

.container {
  position: absolute;
  background-color: rgba($bgColor, $alpha: 0.9);
  border-radius: 32rpx;
  left: 0;
  bottom: 120rpx;
  width: 750rpx - 32rpx * 2;
  box-shadow: $shadow;
}

.bar {
  display: flex;
  justify-content: space-between;
  border-radius: 200rpx;
  box-shadow: $shadow;
  background-color: rgba($color: $bgColor, $alpha: 0.9);
  overflow: hidden;
}

.button {
  width: 96rpx;
  height: 96rpx;
  display: flex;
  color: var(--color);
  align-items: center;
  justify-content: center;
  &:first-child {
    padding-left: 16rpx;
  }
  &:last-child {
    padding-right: 16rpx;
  }

  &.active {
    position: relative;
    color: #fff;
    background-color: var(--color);
  }

  .iconfont {
    font-size: 56rpx;
    &.redo {
      transform: rotateY(180deg);
    }
  }
}
</style>
