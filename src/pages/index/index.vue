<template>
  <!-- #ifndef H5 -->
  <NavBar>涂图了</NavBar>
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

  <!-- 个人中心 -->
  <!-- <Avatar @click="goMyPage"></Avatar> -->

  <!-- 右上角按钮 -->
  <MenuButton :mode="mode" @clickMenu="openMenu" @toggleEye="onToggleBg" @longPressEdit="isBgEdit = true" />

  <!-- 主菜单 -->
  <view class="main-menu" :class="[showMenu ? 'show' : null]">
    <view class="mask cover" @click="hideMenu"></view>
    <!-- 广告位 -->
    <!-- <view class="banner" v-if="showMenu">
      <BottomAd></BottomAd>
    </view> -->
    <!-- 主页面 -->
    <view class="full-page">
      <view class="page-header">
        <view class="app-title">画图模式</view>
        <text class="iconfont icon-close" @click="hideMenu"></text>
      </view>
      <scroll-view class="page-scroll" scroll-y>
        <view class="page-body">
          <view class="menu-item bg-blur" :style="{ backgroundColor: generalBgColor() }" @click="toggleMode(PageMode.FREE)">
            <view class="title">自由画</view>
            <view class="desc">一张“白板”随意画</view>
          </view>
          <view class="menu-item bg-blur" :style="{ backgroundColor: generalBgColor() }" @click="toggleMode(PageMode.COPY)">
            <view class="title">照着画</view>
            <view class="desc">不会画？选择一张图片照着画</view>
          </view>
          <view class="menu-item video-ad">
            <view style="overflow: hidden;">
              <ad class="ad" unit-id="adunit-af124415d4eba99e" ad-type="video" ad-theme="white" :ad-intervals="30"></ad>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>

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
import { useCanvasEvent } from './uses/useCanvasEvent';
// import { useWXUserInfo } from './uses/useWXUserInfo';
import { usePreviewAction, useMenuAction, useCopyAction } from './uses/useToolAction';
import { generalBgColor } from '@/commons/utils';
import { PageMode } from './types';
import { fetchList } from '@/commons/api';


const { getters } = useStore();

/** 模式切换 */
const mode = ref(PageMode.FREE);

const toggleMode = (pageMode: PageMode) => {
  hideMenu();
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

/** 分享 */
onShareAppMessage(() => shareConfig);

onShareTimeline(() => shareConfig);

/** 画笔 */
const { paint } = usePaint('drawCanvas');

/** 初始化 */
watch(paint, () => {
  paint.value?.setImageData(getters.currentStep);
});

/** 绘图事件 */
const { handleTouchStart, handleTouchMove, handleTouchEnd } = useCanvasEvent(paint);

/** 预览 */
const { isPreview, handlePreview, handleEndPreview } = usePreviewAction(paint);

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

onLoad(() => {
  fetchList().then((res) => {
    console.log('--------', res)
  });
})
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

.main-menu {
  position: fixed;
  z-index: 9998;
  .mask {
    transition: all 0.3s;
    opacity: 0;
    pointer-events: none;
    z-index: 0;
  }
  &.show {
    .mask {
      pointer-events: all;
      opacity: 1;
    }
    .full-page {
      transform: translate(0) translateZ(0);
    }
  }

  .banner {
    padding: 0 16rpx;
  }
  .full-page {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    top: 280rpx;
    transform: translateY(100%) translateZ(0);
    transition: all 0.3s;
    background-color: #fff;
    border-radius: 32rpx 32rpx 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    .page-header {
      position: relative;
      padding: 32rpx 32rpx 0;
      background-color: #fff;
      .app-title {
        padding: 8rpx;
        text-align: center;
        font-size: 36rpx;
      }
      .icon-close {
        position: absolute;
        top: 32rpx;
        right: 32rpx;
        font-size: 44rpx;
      }
    }

    .page-scroll {
      height: 800rpx;
      flex: 1;
    }

    .page-body {
      padding: 0 32rpx 32rpx;
      overflow: hidden;
    }
  }

  .menu-item {
    margin-top: 32rpx;
    padding: 40rpx;
    color: #fff;
    text-align: center;
    border-radius: 16rpx;
    &.video-ad {
      padding: 24rpx;
      box-shadow: $shadow;
    }
    .title {
      font-size: 36rpx;
    }
    .desc {
      margin-top: 8rpx;
      font-size: 28rpx;
    }
  }

  .menu-ad {
    margin-top: 32rpx;
  }
}
</style>
