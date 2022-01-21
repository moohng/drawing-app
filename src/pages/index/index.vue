<template>
  <canvas
    id="drawCanvas"
    type="2d"
    class="canvas"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
  ></canvas>
  <!-- <view class="canvas"></view> -->
  <!-- 画笔工具 -->
  <PaintTool></PaintTool>
  <!-- 底部内容区域 -->
  <view class="container">
    <ToolBar :paint="paint" @preview="handlePreview" @save="handleSave" />
  </view>
  <!-- 工具面板 -->
  <view class="preview-cover" v-if="isPreview" :style="{ opacity: '0' }" @click="handleEndPreview"></view>

  <!-- 输入口令弹窗 -->
  <Dialog :visible="showDialog" title="是否设置口令？" :buttons="['不设置', '设置']" @click="handleClick">
    <input v-model="pwd" type="text" placeholder="口令" />
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import * as dan from '@moohng/dan';
import { usePaint } from '@/uses';
import { useCanvasEvent } from './uses/useCanvasEvent';
import { addPath } from '@/commons/api';
import { shareConfig } from '@/commons/config';

const store = useStore();

// 屏幕常亮
onMounted(() => {
  uni.setKeepScreenOn({ keepScreenOn: true });
  return () => {
    uni.setKeepScreenOn({ keepScreenOn: false });
  };
});

// 分享
onShareAppMessage(() => shareConfig);

// 分享朋友圈
onShareTimeline(() => shareConfig);

// 画笔
const paint = usePaint('#drawCanvas');

/** 绘图事件 */
const { handleTouchStart, handleTouchMove, handleTouchEnd } = useCanvasEvent(paint);

/** 预览 */
const isPreview = ref(false);

const handlePreview = () => {
  isPreview.value = true;
  paint.value?.clear();
  paint.value?.playPath(store.state.path, handleEndPreview);
};

const handleEndPreview = () => {
  isPreview.value = false;
  paint.value?.pause();
  paint.value?.drawPath(store.state.path);
};

/** 保存 */
const showDialog = ref(false);
const pwd = ref('');
let code: string;

const handleSave = (text = dan.random(8) as string) => {
  code = text;
  showDialog.value = true;
};

const handleClick = (index: number) => {
  if (index === 1 && !pwd.value) {
    return uni.showToast({ title: '请输入一个口令', icon: 'none' });
  }
  addPath({ code, path: store.state.path, pwd: pwd.value }).then(() => {
    uni.navigateTo({ url: '/pages/play/index?code=' + code });
  });
  showDialog.value = false;
};
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  // padding: 8px 12px;
  // min-height: calc(100vh - 150vw);
  padding-bottom: env(safe-area-inset-bottom);
  padding-bottom: constant(safe-area-inset-bottom);
  // background-color: $uni-bg-color-grey;
  box-sizing: border-box;
  border-radius: 22px 22px 0 0;
}

.tui-dialog input {
  padding: 8px 12px;
  text-align: left;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.tui-dialog input:focus {
  border-color: var(--primaryColor);
  outline: none;
}

.preview-cover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 0.4s;
  background-color: rgba(44, 44, 44, 0.4);
  z-index: 0;
}

.preview-cover .share-img {
  width: 250px;
}
</style>
