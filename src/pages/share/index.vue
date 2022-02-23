<template>
  <view class="top">
    <CanvasVideo :path="getters.currentPathList" :background="getters.backgroundColor" :canvasImg="getters.currentStep"></CanvasVideo>
  </view>

  <view class="list">
    <view class="item bottom-line">
      <view class="label">设置口令</view>
      <input class="input" v-model="pwd" type="text" placeholder="选填" placeholder-class="placeholder">
    </view>
    <view class="tip">设置口令后，好友必须输入正确的口令才能查看</view>
    <view class="item">
      <textarea class="textarea" v-model="shareText" placeholder="说点什么吧..." placeholder-class="placeholder"></textarea>
    </view>
  </view>
  <!-- 底部按钮 -->
  <view class="button-group">
    <view class="button" :style="{ backgroundColor: BG_COLOR_LIST[0] }" @click="handleSave">分享给好友</view>
    <view class="button" :style="{ backgroundColor: BG_COLOR_LIST[1] }" @click="handleDownload">生成图片</view>
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
import { ref, watch } from 'vue';
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import * as dan from '@moohng/dan';
import { shareConfig } from '@/commons/config';
import { generalBgColor } from '@/commons/utils';
import { useStore } from 'vuex';
import { addPath } from '@/commons/api';
import { useDownloadImage, useDrawImage } from '@/uses/useDownloadImage';
import { usePaint } from '@/uses';
import { useGenerateImage } from '@/uses/useGenerateImage';

let path = '/pages/index/index';
let shareImageUrl: string;

const getShareConfig = () => {
  shareConfig.path = path;
  if (shareText.value) {
    shareConfig.title = shareText.value;
  }
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

const { paint } = usePaint('imgCanvas');

onLoad(() => {
  setTimeout(async () => {
    if (!shareImageUrl && paint.value) {
      useDrawImage(paint);
      shareImageUrl = await useGenerateImage('#imgCanvas');
    }
  }, 1000);
});

const pwd = ref('');
const shareText = ref('');
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
    useDrawImage(paint);
    shareImageUrl = await useGenerateImage('imgCanvas');
  }
};

const handleSendFriend = () => {
  showDialog.value = false;
};

const { handleDownload } = useDownloadImage(paint, '#imgCanvas');
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

    .input {
      margin: 16rpx 0;
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

    &.bottom-line {
      border-bottom: 1px solid $uni-border-color;
    }
  }

  .tip {
    margin-top: 8rpx;
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
