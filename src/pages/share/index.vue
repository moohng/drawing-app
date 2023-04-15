<template>
  <view class="top">
    <CanvasVideo :path="store.currentPathList" :background="store.backgroundColor" @change="onCanvasVideoChange"></CanvasVideo>
  </view>

  <view class="list">
    <view class="item bottom-line">
      <view class="label">标题</view>
      <view></view>
    </view>
  </view>
  <!-- 底部按钮 -->
  <view class="button-group">
    <view class="button bg-blur" :style="{ backgroundColor: BG_COLOR_LIST[1] }" @click="handleDownload(paint)">生成图片</view>
    <view class="button bg-blur" :style="{ backgroundColor: BG_COLOR_LIST[0] }" @click="handleVideo">生成视频</view>
  </view>
  <video :src="videoSrc" width="300" height="600"></video>
  <!-- 底部广告 -->
  <view class="bottom-banner" hidden>
    <!-- #ifndef H5 -->
    <ad class="ad" unit-id="adunit-e72cb196c01d4a8c" ad-type="video" ad-theme="white" :ad-intervals="30"></ad>
    <!-- #endif -->
  </view>
  <!-- 分享成功 -->
  <Dialog :visible="showDialog" title="保存成功" @click="showDialog = false">
    <view class="dialog-desc">赶紧分享给好友炫耀一下吧~</view>
    <template #footer>
      <button class="dialog-btn" :style="{ color: store.themeColor }" open-type="share">分享给好友</button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { shareConfig } from '@/commons/config';
import { generalBgColor, showLoading } from '@/commons/utils';
import { useStore } from '@/store';
import { useDownloadImage } from '@/uses/useDownloadImage';
import { useInterstitialAd } from '@/uses/useAd';
import { createRenderVideo } from '@/commons/webgl';
import { createPaint, Paint } from '@/commons/Paint';

let path = '/pages/index/index';
let shareImageUrl: string;

const getShareConfig = () => {
  shareConfig.path = path;
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

const store = useStore();

let paint: Paint;

onLoad(async () => {
  paint = await createPaint();

  // 生成分享图片
  paint.clear();
  paint.setImageData(store.currentStep);
  paint.setBackground(store.backgroundColor, true);
  if (!shareImageUrl) {
    shareImageUrl = await paint.toDataURL('image/jpeg', 0.8);
  }
});

// 保存成功弹窗
const showDialog = ref(false);

// 保存图片
const { handleDownload } = useDownloadImage();

const videoSrc = ref('');

// 保存动画
const handleVideo = async () => {
  showLoading('正在合成视频...');

  const { currentPathList, backgroundColor } = store;

  const { width, height } = paint.ctx.canvas;
  const renderVideo = await createRenderVideo({ width: width * 0.1, height: height * 0.1, fps: 36 });

  // 获取视频帧
  paint.clear();
  paint.setBackground(backgroundColor, true);
  await paint.playPath({
    path: currentPathList,
    onFrame: async () => {
      const frame = await paint.toDataURL('image/jpeg', 0.8);
      await renderVideo(frame);
    },
  });

  const tempFilePath = await renderVideo.stop();

  videoSrc.value = tempFilePath;

  uni.hideLoading();

  // 保存视频
  uni.saveVideoToPhotosAlbum({
    filePath: tempFilePath,
    success: () => {
      showDialog.value = true;
    },
  });
};

// 弹窗广告
const { showInterstitialAd } = useInterstitialAd('adunit-c0ef209d582bf665');

const onCanvasVideoChange = (isPlay: boolean) => {
  if (!isPlay && Math.random() > 0.5) {
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
  }
}

.button-group {
  padding: 32rpx;
  display: flex;
  justify-content: space-between;
  .button {
    width: 47%;
    height: 96rpx;
    color: #fff;
    font-size: 36rpx;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8rpx;
  }
}

.bottom-banner {
  margin: 32rpx;
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
