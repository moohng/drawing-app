<template>
  <!-- #ifdef MP-WEIXIN -->
  <canvas
    id="drawCanvas"
    type="2d"
    class="canvas"
  ></canvas>
  <view
    class="canvas canvas-cover"
    @touchstart.stop="handleTouchStart"
    @touchmove.stop="handleTouchMove"
    @touchend.stop="handleTouchEnd"
    @touchcancel.stop="handleTouchEnd"
  ></view>
  <!-- #endif -->
  <!-- #ifndef MP-WEIXIN -->
  <canvas
    id="drawCanvas"
    canvasId="drawCanvas"
    type="2d"
    class="canvas"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @touchcancel="handleTouchEnd"
  ></canvas>
  <!-- #endif -->
  <!-- 画笔工具 -->
  <!-- <PaintTool></PaintTool> -->
  <!-- 底部内容区域 -->
  <view class="container">
    <!-- 配置面板 -->
    <Panel>
      <PanelTool></PanelTool>
    </Panel>
    <ToolBar :paint="paint" @preview="handlePreview" @save="handleSave" />
  </view>
  <!-- 工具面板 -->
  <view class="preview-cover" v-if="isPreview" :style="{ opacity: '0' }" @click="handleEndPreview"></view>

  <!-- 输入口令弹窗 -->
  <Dialog :visible="showDialog" title="是否设置口令？" :buttons="['不设置', '设置']" @click="handleClick">
    <input placeholder-class="placeholder" v-model="pwd" type="text" placeholder="点击设置" />
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import * as dan from '@moohng/dan';
import { usePaint } from '@/uses';
import { useCanvasEvent } from './uses/useCanvasEvent';
import { addPath } from '@/commons/api';
import { shareConfig } from '@/commons/config';

const { state } = useStore();

// 屏幕常亮
// #ifndef H5
onMounted(() => {
  uni.setKeepScreenOn({ keepScreenOn: true });
  return () => {
    uni.setKeepScreenOn({ keepScreenOn: false });
  };
});
// #endif

// 分享
onShareAppMessage(() => shareConfig);

// 分享朋友圈
onShareTimeline(() => shareConfig);

// 画笔
const paint = usePaint('drawCanvas');

// 设置背景
watch([() => state.backgroundColor, paint], ([color]) => {
  paint.value?.setBackground(color);
  paint.value?.drawPath(state.path);
}, { immediate: true });

/** 绘图事件 */
const { handleTouchStart, handleTouchMove, handleTouchEnd } = useCanvasEvent(paint);

/** 预览 */
const isPreview = ref(false);

const handlePreview = () => {
  isPreview.value = true;
  paint.value?.clear();
  paint.value?.setBackground(state.backgroundColor);
  paint.value?.playPath(state.path, handleEndPreview);
};

const handleEndPreview = () => {
  isPreview.value = false;
  paint.value?.pause();
  paint.value?.drawPath(state.path);
};

/** 保存 */
const showDialog = ref(false);
const pwd = ref('');
let code: string;

const handleSave = (text = dan.random(8) as string) => {
  code = text;
  showDialog.value = true;
};

const handleClick = (index: number | string) => {
  if (index === 1 && !pwd.value) {
    return uni.showToast({ title: '请输入一个口令', icon: 'none' });
  }
  if (index !== 'mask') {
    addPath({
      code,
      path: state.path,
      pwd: pwd.value,
      background: state.backgroundColor,
    }).then(() => {
      uni.navigateTo({ url: '/pages/play/index?code=' + code });
    });
  }
  showDialog.value = false;
  pwd.value = '';
};
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 32rpx;
  // min-height: calc(100vh - 150vw);
  bottom: env(safe-area-inset-bottom);
  bottom: constant(safe-area-inset-bottom);
  // background-color: $uni-bg-color-grey;
  box-sizing: border-box;
  border-radius:44rpx 44rpx 0 0;
}

.canvas-cover {
  position: absolute;
  left: 0;
  top: 0;
}

.tui-dialog input {
  margin: auto;
  padding: 24rpx;
  width: 60%;
  text-align: center;
  font-size: 32rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
}

.tui-dialog input:focus {
  border-color: var(--primaryColor);
  outline: none;
}

::v-deep .tui-dialog__ft .btn:nth-child(2) {
  color: var(--primaryColor);
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
</style>
