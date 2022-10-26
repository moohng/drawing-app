<template>
  <!-- #ifndef H5 -->
  <!-- <NavBar>涂图了</NavBar> -->
  <!-- #endif -->
  <view class="canvas canvas-bg" :style="{ backgroundColor: getters.backgroundColor }"></view>
  <!-- 照着画功能 -->
  <movable-area
    v-if="mode === PageMode.COPY"
    class="canvas canvas-img mask"
    :class="{ cover: isBgEdit }"
    :style="isBgEdit && { zIndex: 99 }"
  >
    <view class="canvas-img-confirm" v-if="isBgEdit" :style="{ color: getters.color }" @click="isBgEdit = false">放置</view>
    <movable-view
      class="canvas-img-wrap"
      :style="{ opacity: bgShow ? (isBgEdit ? 0.8 : 1) : 0 }"
      :y="90"
      direction="all"
      out-of-bounds
      scale
    >
      <image :src="canvasBg" mode="widthFix"></image>
    </movable-view>
  </movable-area>
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

  <!-- 添加小程序提示 -->
  <!-- #ifdef MP -->
  <AddToTip></AddToTip>
  <!-- #endif -->

  <!-- 右上角按钮 -->
  <MenuButton :mode="mode" @clickMenu="$refs.mainPage?.openMenu()" @toggleEye="onToggleBg" @longPressEdit="isBgEdit = true" />

  <!-- 主菜单 -->
  <MainPage ref="mainPage" @toggleMode="toggleMode"></MainPage>

  <!-- 底部内容区域 -->
  <view class="container" :class="{ safeBottom }">
    <view class="bottom-bar">
      <!-- 配置面板 -->
      <Panel :paint="paint" @preview="handlePreview">
        <PanelTool></PanelTool>
      </Panel>
      <!-- 工具栏 -->
      <ToolBar />
    </view>
    <!-- banner -->
    <!-- #ifndef H5 -->
    <BottomAd unit-id="adunit-b9f439209aac273a" @hide="safeBottom = true" />
    <!-- #endif -->
  </view>

  <!-- 预览时的遮罩层 -->
  <view class="mask preview-cover" v-if="isPreview" @click="handleEndPreview"></view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { onHide, onLoad, onShareAppMessage, onShareTimeline, onShow } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import { usePaint } from '@/uses';
import { shareConfig } from '@/commons/config';
import Panel from './components/Panel.vue';
import PanelTool from './components/PanelTool.vue';
import ToolBar from './components/ToolBar.vue';
import MenuButton from './components/MenuButton.vue';
import MainPage from './components/MainPage.vue';
import { useCanvasEvent } from './uses/useCanvasEvent';
import { usePreviewAction, useCopyAction } from './uses/useToolAction';
import { PageMode } from './types';
import { getOpenid } from '@/commons/api';
// import { getPintFromLocal } from '@/commons/utils';


const { getters } = useStore();

/** 模式切换 */
const mode = ref(PageMode.FREE);

const toggleMode = (pageMode: PageMode) => {
  if (pageMode === PageMode.COPY) {
    openAlbum();
  } else {
    mode.value = pageMode;
    canvasBg.value = undefined;
  }
};

/** 照着画 */
const { canvasBg, isBgEdit, bgShow, openAlbum, onToggleBg } = useCopyAction(mode);

/** 屏幕常亮 */
// #ifndef H5
onShow(() => {
  uni.setKeepScreenOn({ keepScreenOn: true });
});
onHide(() => {
  uni.setKeepScreenOn({ keepScreenOn: false });
});
// #endif

onLoad(() => {
  setTimeout(() => {
    getOpenid();
  }, 2000);
});

/** 分享 */
onShareAppMessage(() => shareConfig);

onShareTimeline(() => shareConfig);

/** 画笔 */
const { paint } = usePaint('drawCanvas', () => {
  // if (!state.path.length) {
  //   const { path } = getPintFromLocal();
  //   if (path?.length) {
  //     paint.value?.clear();
  //     paint.value?.drawPath(path);
  //   }
  // }
});

/** 初始化 */
watch(paint, () => {
  paint.value?.setImageData(getters.currentStep);
});

/** 绘图事件 */
const { handleTouchStart, handleTouchMove, handleTouchEnd } = useCanvasEvent(paint);

/** 预览 */
const { isPreview, handlePreview, handleEndPreview } = usePreviewAction(paint);

/** 底部距离控制 */
const safeBottom = ref(false);
</script>

<style lang="scss" scoped>
.container {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 24rpx 32rpx 8rpx;
  box-sizing: border-box;
  border-radius: 44rpx 44rpx 0 0;
  &.safeBottom {
    padding-bottom: 24rpx;
    bottom: env(safe-area-inset-bottom);
    bottom: constant(safe-area-inset-bottom);
  }

  .bottom-bar {
    display: flex;
    panel {
      flex: 1;
    }
  }
}

.canvas-bg {
  z-index: -2;
}
.canvas-img {
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  z-index: -1;

  &-confirm {
    position: fixed;
    padding: 14rpx 48rpx;
    left: 50%;
    bottom: 360rpx;
    transform: translateX(-50%);
    font-weight: bold;
    font-size: 32rpx;
    background-color: #fff;
    border-radius: 100rpx;
    box-shadow: $shadow;
    z-index: 9;
  }

  &-wrap {
    width: 100%;
    opacity: 0.8;
    image {
      display: block;
      width: 100%;
    }
  }
}

.canvas-bg,
.canvas-cover {
  position: absolute;
  left: 0;
  top: 0;
}

.preview-cover {
  z-index: 0;
}
</style>
