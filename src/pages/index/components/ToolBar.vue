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
import { useStore } from 'vuex';
import * as dan from '@moohng/dan';
import { Paint } from '@/commons/Paint';
import { TypeKeys } from '@/store/types';
import { useGenerateImage } from '@/uses/useGenerateImage';
import { download, showLoading } from '@/commons/utils';

const props = defineProps<{
  paint?: Paint;
}>();

const emit = defineEmits<{
  (event: 'save', code: string): void;
  (event: 'preview'): void;
}>();

const { state, getters, commit } = useStore();

/** 操作 */

const handleUndo = () => {
  if (state.currentStepIndex < 0) return uni.showToast({ title: '没有上一步了~', icon: 'none' });
  commit(TypeKeys.OPERATION_UNDO);
  props.paint?.clear();
  props.paint?.setImageData(getters.currentStep || state.lastStep);
};

const handleRedo = () => {
  if (state.currentStepIndex >= state.historyStepList.length - 1) return uni.showToast({ title: '已经是最后一步了~', icon: 'none' });
  commit(TypeKeys.OPERATION_REDO);
  props.paint?.clear();
  props.paint?.setImageData(getters.currentStep);
};

const handleClear = () => {
  if (!state.historyStepList.length) return uni.showToast({ title: '没有可清除的内容！', icon: 'none' });
  uni.showModal({
    title: '警告！',
    content: '确定要清空画布上所有的内容和历史记录吗？',
    showCancel: true,
    cancelText: '取消',
    confirmText: '确定',
    confirmColor: '#dd524d',
    success: (res) => {
      if (res.confirm) {
        props.paint?.clear();
        commit(TypeKeys.OPERATION_CLEAR);
      }
    },
  });
};

const handlePreview = () => {
  if (state.currentPathIndex < 0) {
    return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
  }
  emit('preview');
};

const handleDownload = async () => {
  if (state.currentPathIndex < 0) {
    return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
  }

  showLoading('正在生成图片...');
  // 绘制背景
  props.paint?.setBackground(getters.backgroundColor);
  props.paint?.setImageData(getters.currentStep);

  // 生成图片
  const shareImg = await useGenerateImage('drawCanvas');

  // 去掉背景
  props.paint?.clear();
  props.paint?.setImageData(getters.currentStep);

  // #ifndef H5
  uni.saveImageToPhotosAlbum({
    filePath: shareImg,
    success: () => {
      uni.showToast({ title: '已保存！', icon: 'none' });
    },
    fail: () => {
      uni.showToast({ title: '保存失败！', icon: 'none' });
    },
    complete: () => {
      uni.hideLoading();
    },
  });
  // #endif
  // #ifdef H5
  download(shareImg);
  uni.hideLoading();
  // #endif
};

const handleShare = () => {
  if (state.currentPathIndex < 0) {
    return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
  }
  // 生成随机口令
  const code = dan.random(8) as string;
  emit('save', code);
};
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
