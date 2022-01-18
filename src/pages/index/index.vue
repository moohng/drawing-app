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
  <!-- 工具面板 -->
  <view class="preview-cover" v-if="isPreview" :style="{ opacity: '0' }" @click="handleEndPreview"></view>
  <ToolBar v-else :paint="paint" @preview="handlePreview" @save="handleSave" />
  <!-- 输入口令弹窗 -->
  <Dialog :visible="showDialog" title="请输入口令：" :buttons="['取消', '确定']" @click="handleClick">
    <input v-model="code" type="text" placeholder="口令" />
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ref } from 'vue';
import { useStore } from 'vuex';
import * as dan from '@moohng/dan';
import { usePaint, useShare } from '@/uses';
import { useCanvasEvent } from './uses/useCanvasEvent';
import { addPath } from '@/commons/api';

const store = useStore();

// 屏幕常亮
onMounted(() => {
  uni.setKeepScreenOn({ keepScreenOn: true });
  return () => {
    uni.setKeepScreenOn({ keepScreenOn: false });
  };
});

// 分享
useShare();

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
const code = ref('');

const handleSave = (text = dan.random(8) as string) => {
  code.value = text;
  showDialog.value = true;
};

const handleClick = (index: number) => {
  if (index === 1) {
    if (!code) {
      return uni.showToast({ title: '请输入一个口令', icon: 'none' });
    }
    addPath({ code: code.value, path: store.state.path }).then(() => {
      uni.navigateTo({ url: '/pages/play/index?code=' + code });
    });
  }
  showDialog.value = false;
};
</script>

<style lang="scss" scoped>
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
