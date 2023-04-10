<template>
  <view class="main-menu" :class="[showMenu ? 'show' : null]">
    <view class="mask cover" @click="hideMenu"></view>
    <!-- 主页面 -->
    <view class="full-page">
      <view class="bg" :style="topBg"></view>
      <!-- 用户头像 -->
      <view class="page-header">
        <view class="user-info" @click="getUserInfo">
          <view class="avatar">
            <image class="image" :src="userInfo?.avatarUrl || defaultAvatarUrl"></image>
          </view>
          <view class="nickname">{{ userInfo?.nickName || '点击获取头像' }}</view>
          <!-- <view class="button bg-blur" :style="{ backgroundColor: getters.themeColor }" v-if="userInfo" @click="goMyPage">我的画作</view> -->
        </view>
        <text class="iconfont icon-close" @click="hideMenu"></text>
      </view>
      <!-- 主题部分 -->
      <view class="page-body">
        <view class="group">
          <view class="menu-item bg-blur" :style="{ backgroundColor: generalBgColor() }" @click="hideMenu(), emit('toggleMode', PageMode.FREE)">
            <view class="title">自由画</view>
            <view class="desc">一张“白板”随意画</view>
          </view>
          <view class="menu-item bg-blur" :style="{ backgroundColor: generalBgColor() }" @click="hideMenu(), emit('toggleMode', PageMode.COPY)">
            <view class="title">照着画</view>
            <view class="desc">选张图片照着画</view>
          </view>
        </view>
        <view class="menu-item bg-blur" :style="{ backgroundColor: generalBgColor() }" @click="handleOpenPic">
          <view class="title">图片处理</view>
          <view class="desc">图片裁剪、压缩、拼接一键搞定</view>
        </view>
        <!-- #ifndef H5 -->
        <view class="menu-ad">
          <BottomAd unit-id="adunit-af124415d4eba99e" />
        </view>
        <!-- #endif -->
        <!-- <view class="menu-ad">
          <ad class="ad" unit-id="adunit-af124415d4eba99e" ad-type="video" ad-theme="white" :ad-intervals="30"></ad>
        </view> -->
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { defaultAvatarUrl } from '@/commons/config';
import { generalBgColor } from '@/commons/utils';
import { TypeKeys } from '@/store/modules/user';
import { computed } from 'vue';
import { useStore } from 'vuex';
import { PageMode } from '../types';
import { useMenuAction } from '../uses/useToolAction';


const { state, getters, commit } = useStore();

const emit = defineEmits<{
  (event: 'toggleMode', mode: PageMode): void;
}>();

const topBg = computed(() => {
  return {
    background: `linear-gradient(to bottom, ${getters.themeBgColor}, transparent)`,
 };
});

/** 菜单 */
const { showMenu, openMenu, hideMenu } = useMenuAction();

/** 开放接口 */
defineExpose({
  openMenu,
});

const userInfo = computed(() => state.user.userInfo);

const getUserInfo = () => {
  if (userInfo.value) return;
  uni.getUserProfile({
    desc: '为了更好的用户体验',
    success: (res) => {
      commit(TypeKeys.SET_USER_INFO, res.userInfo);
    },
  });
};

const handleOpenPic = () => {
  uni.navigateToMiniProgram({ appId: 'wxe6e3233ef8b8e3e5' });
};
</script>

<style lang="scss" scoped>
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
    transform: translateY(100%) translateZ(0);
    transition: all 0.3s;
    background-color: #fff;
    border-radius: 32rpx 32rpx 0 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    .bg {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      height: 440rpx;
      border-radius: 0 0 16rpx 16rpx;
      z-index: -1;
    }

    .page-header {
      position: relative;
      padding: 56rpx 32rpx 32rpx;
      // background-color: #fff;
      .user-info {
        padding-right: 96rpx;
        display: flex;
        align-items: center;
      }
      .avatar {
        margin-right: 32rpx;
        width: 112rpx;
        height: 112rpx;
        border-radius: 120rpx;
        overflow: hidden;
        .image {
          width: 100%;
          height: 100%;
        }
      }
      .nickname {
        margin-right: 32rpx;
        flex: 1;
        font-size: 36rpx;
        overflow: hidden;
      }
      .button {
        margin-left: auto;
        padding: 12rpx 32rpx;
        color: #fff;
        border-radius: 8rpx;
        z-index: 0;
      }
      .icon-close {
        position: absolute;
        top: 16rpx;
        right: 32rpx;
        font-size: 44rpx;
      }
    }

    .page-body {
      padding: 0 32rpx 32rpx;
      overflow: hidden;
    }
  }

  .group {
    display: flex;
    .menu-item {
      width: 50%;
      flex: 1;
      + .menu-item {
        margin-left: 32rpx;
      }
    }
  }

  .menu-item {
    margin-top: 32rpx;
    padding: 40rpx 20rpx;
    color: #fff;
    text-align: center;
    border-radius: 16rpx;

    .title {
      font-size: 40rpx;
      font-weight: bold;
    }

    .desc {
      margin-top: 8rpx;
      font-size: 28rpx;
    }
  }

  .menu-ad {
    margin-top: 32rpx;
    border-radius: 16rpx;
    overflow: hidden;

    :deep(ad) {
      margin-top: 0;
    }
  }
}
</style>
