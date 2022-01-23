<template>
  <!-- 操作区域 -->
  <view class="toolbar" :style="{ color: state.color }">
    <view class="button" @click="handleUndo"><text class="iconfont icon-undo"></text></view>
    <view class="button" @click="handleClear"><text class="iconfont icon-clear"></text></view>
    <view class="button" @click="handlePreview"><text class="iconfont icon-play"></text></view>
    <view class="button" @click="handleDownload"><text class="iconfont icon-download"></text></view>
    <view class="button" @click="handleShare"><text class="iconfont icon-share"></text></view>
  </view>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import * as dan from '@moohng/dan';
import { Paint } from '@/commons/Paint';
import { TypeKeys } from '@/store/types';
import { useGenerateImage } from '@/uses/useGenerateImage';

const props = defineProps<{
  paint?: Paint;
}>();

const emit = defineEmits<{
  (event: 'save', code: string): void;
  (event: 'preview'): void;
}>();

const { state, commit } = useStore();

/** 操作 */

const handleUndo = () => {
  const path = state.path.slice(0, state.path.length - 1);
  commit(TypeKeys.SET_PATH, path);

  props.paint?.clear();
  props.paint?.setBackground(state.backgroundColor);
  props.paint?.drawPath(path);
};

const handleClear = () => {
  commit(TypeKeys.SET_PATH, []);

  props.paint?.clear();
  props.paint?.setBackground(state.backgroundColor);
};

const handlePreview = () => {
  if (!state.path.length) {
    return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
  }
  emit('preview');
};

const handleDownload = async () => {
  if (!state.path.length) {
    return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
  }
  // 生成图片
  const shareImg = await useGenerateImage('#drawCanvas');

  uni.saveImageToPhotosAlbum({
    filePath: shareImg,
    success: () => {
      uni.showToast({ title: '已保存！', icon: 'none' });
    },
    fail: () => {
      uni.showToast({ title: '保存失败！', icon: 'none' });
    },
  });
};

const handleShare = () => {
  if (!state.path.length) {
    return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
  }
  // 生成随机口令
  const code = dan.random(8) as string;
  emit('save', code);
};
</script>

<style lang="scss" scoped>
.toolbar {
  display: flex;
  justify-content: space-around;
  top: 0;
  left: 50%;
  background-color: rgba($color: #f2f2f2, $alpha: 0.9);
  border-radius: 200rpx;
  box-shadow: 0 2rpx 24rpx 0 rgba(#333, 0.1);
}

.toolbar .button {
  width: 96rpx;
  height: 96rpx;
  // color: var(--primaryColor);
  border-radius: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;

  &:active {
    background-color: rgba(#00CCFF, 0.2);
  }
}

.toolbar .button .iconfont {
  font-size: 56rpx;
}
</style>
