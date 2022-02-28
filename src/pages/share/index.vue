<template>
  <view class="top">
    <CanvasVideo :path="getters.currentPathList" :background="getters.backgroundColor" @change="onCanvasVideoChange"></CanvasVideo>
  </view>

  <view class="list">
    <view class="item bottom-line">
      <view class="label">标题</view>
      <input class="input" v-model="title" type="text" placeholder="给作品起一个标题吧" placeholder-class="placeholder">
    </view>
  </view>
  <!-- 底部按钮 -->
  <view class="button-group">
    <view class="button bg-blur" :style="{ backgroundColor: BG_COLOR_LIST[0] }" @click="handleSave">保存到画作</view>
    <view class="button bg-blur" :style="{ backgroundColor: BG_COLOR_LIST[1] }" @click="handleDownload">生成图片</view>
  </view>
  <!-- 底部广告 -->
  <view class="bottom-banner">
    <!-- #ifndef H5 -->
    <ad class="ad" unit-id="adunit-e72cb196c01d4a8c" ad-type="video" ad-theme="white" :ad-intervals="30"></ad>
    <!-- #endif -->
  </view>
  <!-- 分享成功 -->
  <Dialog :visible="showDialog" title="保存成功" @click="handleSendFriend">
    <view class="dialog-desc">赶紧分享给好友炫耀一下吧~</view>
    <template #footer>
      <button class="dialog-btn" :style="{ color: getters.themeColor }" open-type="share">分享给好友</button>
    </template>
  </Dialog>
  <!-- 用于生成图片隐藏的canvas -->
  <canvas class="img-canvas" id="imgCanvas" type="2d"></canvas>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { shareConfig } from '@/commons/config';
import { generalBgColor, showLoading } from '@/commons/utils';
import { useStore } from 'vuex';
import { addPath, uploadImage } from '@/commons/api';
import { useDownloadImage, useDrawImage } from '@/uses/useDownloadImage';
import { usePaint } from '@/uses';
import { useGenerateImage } from '@/uses/useGenerateImage';
import { useInterstitialAd } from '@/uses/useAd';

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

const { getters } = useStore();

const { paint } = usePaint('imgCanvas', async () => {
  useDrawImage(paint, getters);
  if (!shareImageUrl && paint.value) {
    shareImageUrl = await useGenerateImage('#imgCanvas');
  }
});

const title = ref('');
const showDialog = ref(false);

const handleSave = async () => {
  showLoading('正在保存...');
  if (!shareImageUrl) {
    useDrawImage(paint, getters);
    shareImageUrl = await useGenerateImage('#imgCanvas');
  }
  // 上传图片信息
  const res = await uploadImage(shareImageUrl);
  // 保存
  addPath({
    path: getters.currentPathList,
    title: title.value,
    background: getters.backgroundColor,
    imgUrl: res.fileID,
  }).then(({ _id }: any) => {
    path = '/pages/play/index?id=' + _id,
    showDialog.value = true;
  });
};

const handleSendFriend = () => {
  showDialog.value = false;
};

const { handleDownload } = useDownloadImage(paint, '#imgCanvas');

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
