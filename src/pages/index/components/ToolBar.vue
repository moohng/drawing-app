<template>
  <!-- 操作区域 -->
  <view class="toolbar" :style="{ color: getters.color }">
    <button class="button" @click="handleUndo" @longpress="handleClear"><text class="iconfont icon-undo"></text></button>
    <button class="button" @click="handleRedo"><text class="iconfont icon-undo redo"></text></button>
    <!-- <button class="button" @click="handleClear"><text class="iconfont icon-clear"></text></button> -->
    <button class="button" @click="handlePreview"><text class="iconfont icon-play"></text></button>
    <button class="button" @click="handleDownload"><text class="iconfont icon-download"></text></button>
    <button class="button" @click="handleShare"><text class="iconfont icon-share"></text></button>
  </view>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import { useStore } from 'vuex';
import { Paint } from '@/commons/Paint';
import { useToolAction } from '../uses/useToolAction';

const { paint } = defineProps<{
  paint?: Paint;
}>();

interface Emits {
  (event: 'save', code: string): void;
  (event: 'preview'): void;
}

const emit = defineEmits<Emits>();

const { getters } = useStore();

/** 操作 */
const { handleUndo, handleRedo, handleClear, handlePreview, handleDownload, handleShare } = useToolAction(emit, paint);

</script>

<style lang="scss" scoped>
.toolbar {
  padding: 0 16rpx;
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
  border-radius: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  color: currentColor;
  font-weight: normal;
  background-color: transparent;

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

  .redo {
    transform: rotateY(180deg);
  }
}
</style>
