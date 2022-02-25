<template>
  <view class="top">
    <CanvasVideo :path="getters.currentPathList" :background="getters.backgroundColor" @change="onCanvasVideoChange"></CanvasVideo>
  </view>

  <view class="list">
    <view class="item bottom-line">
      <view class="label">设置口令<text class="tip">（输入正确的口令才能查看）</text></view>
      <input class="input" v-model="pwd" type="text" placeholder="选填" placeholder-class="placeholder">
    </view>
    <!-- <view class="item">
      <textarea class="textarea" v-model="shareText" placeholder="说点什么吧..." placeholder-class="placeholder"></textarea>
    </view> -->
  </view>
  <!-- 底部按钮 -->
  <view class="button-group">
    <view class="button bg-blur" :style="{ backgroundColor: BG_COLOR_LIST[0] }" @click="handleSave">分享给好友</view>
    <view class="button bg-blur" :style="{ backgroundColor: BG_COLOR_LIST[1] }" @click="handleDownload">生成图片</view>
  </view>
  <!-- 底部广告 -->
  <view class="bottom-banner">
    <!-- #ifndef H5 -->
    <ad class="ad" unit-id="adunit-e72cb196c01d4a8c" ad-type="video" ad-theme="white" :ad-intervals="30"></ad>
    <!-- <BottomAd unit-id="adunit-8c87109d0e3eaafc" /> -->
    <!-- #endif -->
  </view>
  <!-- 分享成功 -->
  <Dialog :visible="showDialog" title="保存成功" @click="handleSendFriend">
    <view class="dialog-desc">赶紧发送给好友炫耀一下吧~</view>
    <template #footer>
      <button class="dialog-btn" :style="{ color: getters.themeColor }" open-type="share">发送给好友</button>
    </template>
  </Dialog>
  <!-- 用于生成图片隐藏的canvas -->
  <canvas class="img-canvas" id="imgCanvas" type="2d"></canvas>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import * as dan from '@moohng/dan';
import { shareConfig } from '@/commons/config';
import { generalBgColor } from '@/commons/utils';
import { useStore } from 'vuex';
import { addPath } from '@/commons/api';
import { useDownloadImage, useDrawImage } from '@/uses/useDownloadImage';
import { usePaint } from '@/uses';
import { useGenerateImage } from '@/uses/useGenerateImage';
import { useInterstitialAd } from '@/uses/useAd';

let path = '/pages/index/index';
let shareImageUrl: string;

const getShareConfig = () => {
  shareConfig.path = path;
  // if (shareText.value) {
  //   shareConfig.title = shareText.value;
  // }
  if (shareImageUrl) {
    shareConfig.imageUrl = shareImageUrl;
  }
  return shareConfig;
};

// 分享
onShareAppMessage(() => getShareConfig());
// 分享朋友圈
onShareTimeline(() => getShareConfig());

const BG_COLOR_LIST = [generalBgColor(), generalBgColor()];

const { getters } = useStore();

const { paint } = usePaint('imgCanvas', async () => {
  useDrawImage(paint, getters);
  if (!shareImageUrl && paint.value) {
    shareImageUrl = await useGenerateImage('#imgCanvas');
  }
});

const pwd = ref('');
// const shareText = ref('');
const showDialog = ref(false);

const handleSave = async () => {
  const code = dan.random(8) as string;
  addPath({
    code,
    path: getters.currentPathList,
    pwd: pwd.value,
    background: getters.backgroundColor,
  }).then(() => {
    path = '/pages/play/index?code=' + code,
    showDialog.value = true;
  });
  if (!shareImageUrl) {
    useDrawImage(paint, getters);
    shareImageUrl = await useGenerateImage('#imgCanvas');
  }
};

const handleSendFriend = () => {
  showDialog.value = false;
};

const { handleDownload } = useDownloadImage(paint, '#imgCanvas');

// 弹窗广告
const { showInterstitialAd } = useInterstitialAd('adunit-c0ef209d582bf665');

const onCanvasVideoChange = (isPlay: boolean) => {
  if (!isPlay && Math.random() > 0.3) {
    showInterstitialAd();
  }
};
</script>

<style lang="scss" scoped>
.top {
  height: 520rpx;
}

.list {
  padding: 32rpx;
  font-size: 32rpx;

  .item {
    padding: 8rpx 0;

    .label {
      display: flex;
      align-items: baseline;
      font-size: 36rpx;
    }

    .input {
      margin: 24rpx 0;
      width: 100%;
      margin-left: auto;
      font-size: 100%;
    }

    .textarea {
      margin-top: 32rpx;
      width: 100%;
      height: 220rpx;
      font-size: 100%;
    }
  }

  .tip {
    margin-left: 8rpx;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-sm;
  }
}

.button-group {
  padding: 16rpx 32rpx;
  display: flex;
  justify-content: space-between;
  .button {
    width: 47%;
    height: 96rpx;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

.bottom-banner {
  margin: 16rpx 32rpx;
}

.dialog-btn {
  padding: 12rpx 32rpx;
  width: 100%;
  color: #333;
  letter-spacing: 2rpx;
  text-decoration: none;
  font-weight: 700;
  font-size: 32rpx;
  background-color: transparent;
  &::after {
    border: none;
  }
}

.img-canvas {
  position: fixed;
  opacity: 0;
  transform: translateX(10000px);
}

</style>
