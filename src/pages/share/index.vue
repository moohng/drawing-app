<template>
  <view class="top">
    <CanvasVideo :path="store.currentPathList" :background="store.backgroundColor" @change="onCanvasVideoChange"></CanvasVideo>
  </view>

  <view class="item">操作</view>
  <!-- 按钮 -->
  <view class="button-group">
    <view class="button bg-blur" :style="{ backgroundColor: BG_COLOR_LIST[1] }" @click="handleSaveImage">生成图片</view>
    <view class="button bg-blur" :style="{ backgroundColor: BG_COLOR_LIST[0] }" @click="handleSaveVideo">生成视频</view>
  </view>
  <!-- 底部说明 -->
  <view class="bottom-tips">
    <view class="label">说明：</view>
    <view>1. 生成视频耗时可能比较长，建议时长控制在10s内；</view>
    <view>2. 生成视频耗时可能比较长，建议时长控制在10s内；</view>
    <view>3. 生成视频耗时可能比较长，建议时长控制在10s内；</view>
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
import { useDownloadOperation } from '@/uses/useDownloadImage';
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

const { beforeSave } = useDownloadOperation();

// 保存图片
const handleSaveImage = async () => {
  try {
    await beforeSave();
  } catch (err: any) {
    err && uni.showToast({ title: err.message, icon: 'none' });
    return;
  }

  showLoading('正在生成图片...');

  // 绘制图像
  paint.clear();
  paint.setImageData(store.currentStep);
  paint.setBackground(store.backgroundColor, true);

  // 生成图片
  const shareImg = await paint.toDataURL() as string;

  uni.saveImageToPhotosAlbum({
    filePath: shareImg,
    success: () => {
      showDialog.value = true;
    },
    fail: () => {
      uni.showToast({ title: '保存失败！', icon: 'none' });
    },
  });
}

// 保存视频
const handleSaveVideo = async () => {
  try {
    await beforeSave();
  } catch (err: any) {
    err && uni.showToast({ title: err.message, icon: 'none' });
    return;
  }

  showLoading('正在合成视频...');

  const { currentPathList, backgroundColor } = store;

  const width = 270;
  const height = 480;
  const renderVideo = await createRenderVideo({ width, height });

  // 获取视频帧
  paint.clear();
  paint.setBackground(backgroundColor, true);
  await paint.playPath({
    path: currentPathList,
    onFrame: async () => {
      const frame = await paint.toDataURL('image/png');
      await renderVideo(frame);
    },
  });

  const tempFilePath = await renderVideo.stop();

  uni.hideLoading();

  // 保存视频
  uni.saveVideoToPhotosAlbum({
    filePath: tempFilePath,
    success: () => {
      showDialog.value = true;
    },
    fail: () => {
      uni.showToast({ title: '保存失败！', icon: 'none' });
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
.item {
  padding: 32rpx;
  font-size: 32rpx;
}

.button-group {
  padding: 16rpx 32rpx 32rpx;
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

.bottom-tips {
  padding: 32rpx;
  font-size: 28rpx;
  color: #999;

  .label {
    margin-bottom: 8rpx;
  }
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
</style>
