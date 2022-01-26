<template>
  <!-- 操作区域 -->
  <view class="toolbar" :style="{ color: state.color }">
    <button class="button" @click="handleUndo"><text class="iconfont icon-undo"></text></button>
    <button class="button" @click="handleClear"><text class="iconfont icon-clear"></text></button>
    <button class="button" @click="handlePreview"><text class="iconfont icon-play"></text></button>
    <button class="button" @click="handleDownload"><text class="iconfont icon-download"></text></button>
    <button class="button" @click="handleShare"><text class="iconfont icon-share"></text></button>
  </view>
</template>

<script setup lang="ts">
import { useStore } from 'vuex';
import * as dan from '@moohng/dan';
import { Paint } from '@/commons/Paint';
import { TypeKeys } from '@/store/types';
import { useGenerateImage } from '@/uses/useGenerateImage';
import { download } from '@/commons/utils';

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
  const shareImg = await useGenerateImage('drawCanvas');

  // #ifndef H5
  uni.saveImageToPhotosAlbum({
    filePath: shareImg,
    success: () => {
      uni.showToast({ title: '已保存！', icon: 'none' });
    },
    fail: () => {
      uni.showToast({ title: '保存失败！', icon: 'none' });
    },
  });
  // #endif
  // #ifdef H5
  download(shareImg);
  // #endif
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
  background-color: rgba($bgColor, 0.9);
  border-radius: 200rpx;
  box-shadow: 0 4rpx 16rpx 0 rgba($bgColor, 0.4);
}

.toolbar .button {
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
}
</style>
