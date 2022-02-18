<template>
  <view class="canvas canvas-bg" :style="{ backgroundColor: getters.backgroundColor }"></view>
  <!-- 照着画功能 -->
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

  <!-- 主菜单 -->
  <MenuButton @click="openMenu" />
  <view class="main-menu mask" :class="[showMenu ? 'cover' : null]">
    <!-- 广告位 -->
    <!-- 主页面 -->
    <view class="full-page">
      <view class="app-title">涂图了</view>
      <text class="iconfont icon-close" @click="hideMenu"></text>
      <view class="menu-item">
        <view class="title">自由画</view>
        <view class="desc">一张白板随意画</view>
      </view>
      <view class="menu-item">
        <view class="title">照着画</view>
        <view class="desc">不会画？选择一张图片照着画</view>
      </view>
    </view>
  </view>

  <!-- 底部内容区域 -->
  <view class="container" :class="{ safeBottom }">
    <view class="bottom-bar">
      <!-- 配置面板 -->
      <Panel>
        <PanelTool></PanelTool>
      </Panel>
      <!-- 工具栏 -->
      <ToolBar :paint="paint" @preview="handlePreview" @save="handleSave" />
    </view>
    <!-- banner -->
    <BottomAd @hide="safeBottom = true" />
  </view>

  <!-- 预览时的遮罩层 -->
  <view class="mask preview-cover" v-if="isPreview" @click="handleEndPreview"></view>

  <!-- 输入口令弹窗 -->
  <Dialog :visible="showDialog" title="是否设置口令？" :buttons="['不设置', '设置']" @click="handleSaveConfirm">
    <input placeholder-class="placeholder" v-model="pwd" type="text" placeholder="点击设置" />
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import { usePaint } from '@/uses';
import { shareConfig } from '@/commons/config';
import Panel from './components/Panel.vue';
import PanelTool from './components/PanelTool.vue';
import ToolBar from './components/ToolBar.vue';
import MenuButton from './components/MenuButton.vue';
import { useCanvasEvent } from './uses/useCanvasEvent';
// import { useWXUserInfo } from './uses/useWXUserInfo';
import { useSaveAction, usePreviewAction, useMenuAction } from './uses/useToolAction';

const { getters } = useStore();

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

/** 屏幕常亮 */
// #ifndef H5
onMounted(() => {
  uni.setKeepScreenOn({ keepScreenOn: true });
  return () => {
    uni.setKeepScreenOn({ keepScreenOn: false });
  };
});
// #endif

/** 分享 */
onShareAppMessage(() => shareConfig);

onShareTimeline(() => shareConfig);

/** 画笔 */
const paint = usePaint('drawCanvas');

/** 初始化 */
watch(paint, () => {
  paint.value?.setImageData(getters.currentStep);
});

/** 绘图事件 */
const { handleTouchStart, handleTouchMove, handleTouchEnd } = useCanvasEvent(paint);

/** 预览 */
const { isPreview, handlePreview, handleEndPreview } = usePreviewAction(paint);

/** 保存 */
const { showDialog, pwd, handleSave, handleSaveConfirm } = useSaveAction();

/** 个人中心 */
// const goMyPage = () => {
//   if (state.user.openId) {
//     uni.navigateTo({ url: '/pages/my/index' });
//   } else {
//     useWXUserInfo((userInfo) => {
//       // 获取 openId

//       // 保存数据并跳转
//       commit(TypeKeys.SET_USER_INFO, userInfo);
//       uni.navigateTo({ url: '/pages/my/index' });
//     });
//   }
// };

/** 底部距离控制 */
const safeBottom = ref(false);

/** 菜单 */
const { showMenu, openMenu, hideMenu } = useMenuAction();
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
    tool-bar {
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

.main-menu {
  transition: all 0.3s;
  opacity: 0;
  pointer-events: none;
  &.cover {
    pointer-events: all;
    opacity: 1;
    .full-page {
      transform: translate(0) translateZ(0);
    }
  }
  .full-page {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 32rpx;
    height: 80%;
    transform: translateY(100%) translateZ(0);
    transition: all 0.3s;
    background-color: #fff;
    border-radius: 32rpx 32rpx 0 0;

    .icon-close {
      position: absolute;
      top: 24rpx;
      right: 32rpx;
      font-size: 44rpx;
    }
  }

  .app-title {
    margin-bottom: 36rpx;
    text-align: center;
  }

  .menu-item {
    padding: 40rpx;
    color: #fff;
    text-align: center;
    background-color: rgb(42, 190, 235);
    border-radius: 16rpx;
    box-shadow: $shadow;
    + .menu-item {
      margin-top: 32rpx;
    }
    .title {
      font-size: 36rpx;
    }
    .desc {
      margin-top: 8rpx;
      font-size: 28rpx;
    }
  }
}
</style>
