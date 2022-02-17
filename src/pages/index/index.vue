<template>
  <view class="canvas canvas-bg" :style="{ backgroundColor: getters.backgroundColor }"></view>
  <movable-area
    class="canvas canvas-img mask"
    :class="{ cover: isBgEdit }"
    :style="isBgEdit && { zIndex: 1, opacity: 1 }"
  >
    <view class="canvas-img-confirm" :style="{ color: getters.color }" @click="isBgEdit = false">放置</view>
    <movable-view class="canvas-img-wrap" direction="all" :y="100" out-of-bounds scale>
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

  <!-- 个人中心 -->
  <!-- <Avatar @click="goMyPage"></Avatar> -->

  <!-- 底部内容区域 -->
  <view class="container" :class="{ safeBottom }">
    <!-- 配置面板 -->
    <Panel>
      <PanelTool></PanelTool>
    </Panel>
    <!-- 工具栏 -->
    <ToolBar :paint="paint" @preview="handlePreview" @save="handleSave" />
    <!-- banner -->
    <BottomAd @hide="safeBottom = true" />
  </view>

  <!-- 预览时的遮罩层 -->
  <view class="mask preview-cover" v-if="isPreview" @click="handleEndPreview"></view>

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
import { addPath } from '@/commons/api';
import { shareConfig } from '@/commons/config';
import Panel from './components/Panel.vue';
import PanelTool from './components/PanelTool.vue';
import ToolBar from './components/ToolBar.vue';
import BottomAd from './components/BottomAd.vue';
import { useCanvasEvent } from './uses/useCanvasEvent';
import { useWXUserInfo } from './uses/useWXUserInfo';
import { TypeKeys } from '@/store/modules/user';

const { state, getters, commit } = useStore();

const canvasBg = ref<string>();
const isBgEdit = ref(false);

const onClick = () => {
  uni.chooseImage({
    count: 1,
    success: ({ tempFilePaths }) => {
      isBgEdit.value = true;
      canvasBg.value = tempFilePaths[0];
    },
  });
};

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

// 初始化
watch(paint, () => {
  paint.value?.setImageData(getters.currentStep);
});

/** 绘图事件 */
const { handleTouchStart, handleTouchMove, handleTouchEnd } = useCanvasEvent(paint);

/** 预览 */
const isPreview = ref(false);

const handlePreview = () => {
  isPreview.value = true;
  paint.value?.clear();
  paint.value?.playPath((getters.currentPathList), handleEndPreview);
};

const handleEndPreview = () => {
  isPreview.value = false;
  paint.value?.pause();
  paint.value?.clear();
  paint.value?.setImageData(getters.currentStep);
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
      path: getters.currentPathList,
      pwd: pwd.value,
      background: getters.backgroundColor,
    }).then(() => {
      uni.navigateTo({ url: '/pages/play/index?code=' + code });
    });
  }
  showDialog.value = false;
  pwd.value = '';
};

/** 个人中心 */
const goMyPage = () => {
  if (state.user.openId) {
    uni.navigateTo({ url: '/pages/my/index' });
  } else {
    useWXUserInfo((userInfo) => {
      // 获取 openId

      // 保存数据并跳转
      commit(TypeKeys.SET_USER_INFO, userInfo);
      uni.navigateTo({ url: '/pages/my/index' });
    });
  }
};

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
  border-radius:44rpx 44rpx 0 0;
  background-color: #ccc;
  &.safeBottom {
    padding-bottom: 24rpx;
    bottom: env(safe-area-inset-bottom);
    bottom: constant(safe-area-inset-bottom);
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
  opacity: 0.8;

  &-confirm {
    position: absolute;
    padding: 8rpx 32rpx;
    right: 32rpx;
    top: 32rpx;
    font-weight: bold;
    background-color: #fff;
    border-radius: 100rpx;
    box-shadow: $shadow;
    z-index: 9;
  }

  &-wrap {
    width: 100%;
    height: fit-content;
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
  z-index: 0;
}
</style>
