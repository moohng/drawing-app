<template>
  <view class="top">
    <CanvasVideo :path="state.path" :background="getters.backgroundColor" :canvasImg="getters.currentStep"></CanvasVideo>
  </view>
  <view class="list">
    <view class="item">
      <view class="label">设置口令</view>
      <input class="input" v-model="pwd" type="text" placeholder="选填" placeholder-class="placeholder">
    </view>
    <view class="tip">设置口令后，好友必须输入正确的口令才能查看</view>
    <view class="item">
      <textarea class="textarea" v-model="shareText" placeholder="说点什么吧..." placeholder-class="placeholder"></textarea>
    </view>
  </view>
  <view class="button-group">
    <view class="button" :style="{ backgroundColor: BG_COLOR_LIST[0] }" @click="handleSave">分享给好友</view>
    <view class="button" :style="{ backgroundColor: BG_COLOR_LIST[1] }" @click="handleDownload">生成图片</view>
  </view>
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
import { useDownloadImage } from '@/uses/useDownloadImage';
import { Paint } from '@/commons/Paint';
import { usePaint } from '@/uses';

// 分享
onShareAppMessage(() => ({
  ...shareConfig,
  title: shareText.value,
}));
// 分享朋友圈
onShareTimeline(() => ({
  ...shareConfig,
  title: shareText.value,
}));

const BG_COLOR_LIST = [generalBgColor(), generalBgColor()];

const { state, getters } = useStore();

const { paint, canvas } = usePaint('imgCanvas');

const pwd = ref('');
const shareText = ref('');

const handleSave = () => {
  const code = dan.random(8) as string;
  addPath({
    code,
    path: getters.currentPathList,
    pwd: pwd.value,
    background: getters.backgroundColor,
  }).then(() => {
    // 去分享
  });
};

const { handleDownload } = useDownloadImage(paint, canvas);
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
    display: flex;
    align-items: center;

    .input {
      margin-left: auto;
      text-align: right;
    }

    .textarea {
      margin-top: 32rpx;
      width: 100%;
      height: 220rpx;
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

.img-canvas {
  // position: fixed;
  // opacity: 0;
  // transform: translateX(10000px);
  width: 100vw;
  height: 100vh;
}

</style>
