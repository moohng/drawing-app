<template>
  <canvas id="drawCanvas" canvasId="drawCanvas" type="2d" class="canvas" @click="handlePlayToggle" />

  <!-- 播放中止遮罩层 -->
  <view class="mask cover preview-cover" v-if="!isPlaying">
    <view class="share-tips">点击右上角“···”，可分享到“朋友圈”</view>
    <text class="iconfont icon-play" @click="handlePlayToggle"></text>
    <view class="bottom" :class="{ safeBottom }">
      <button class="btn" :style="{ color: getters.themeColor }" open-type="share">分享给好友<text class="iconfont icon-share"></text></button>
      <view class="btn" @click="handleGoPlay">我也要玩<text class="iconfont icon-pen"></text></view>
      <!-- banner -->
      <BottomAd unit-id="adunit-f990e4999b6ab2ce" @hide="safeBottom = true" />
    </view>
  </view>

  <!-- 口令 -->
  <Dialog :visible="showDialog" title="请输入口令：" :buttons="['确定']" @click="handleClick">
    <input placeholder-class="placeholder" v-model="codeRef" type="text" placeholder="口令" />
  </Dialog>

  <!-- 异常 -->
  <Dialog :visible="errorDialog" title="数据异常！" :buttons="['确定']" @click="handleErrorClick"></Dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { fetchPath } from '@/commons/api';
import { shareConfig } from '@/commons/config';
import { usePaint } from '@/uses';
import { pathFallback } from '@/commons/utils';
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { Path } from '@/store/types';
import { useGenerateImage } from '@/uses/useGenerateImage';
import { useStore } from 'vuex';
// import { useInterstitialAd } from '@/uses/useAd';

let shareImageUrl = '';

// 分享
onShareAppMessage(() => ({
  ...shareConfig,
  imageUrl: shareImageUrl,
}));

// 分享朋友圈
onShareTimeline(() => ({
  ...shareConfig,
  imageUrl: shareImageUrl,
}));

const { getters } = useStore();

// 画笔
const { paint, canvas } = usePaint('drawCanvas');

const isPlaying = ref(true);

const showDialog = ref(false);
const errorDialog = ref(false);

let localState: {
  title?: string;
  path: Path[];
  background: string;
  pwd: string;
};

// const { interstitialAd } = useInterstitialAd();

watch(isPlaying, async (value) => {
  // 播放暂停时
  if (!value) {
    // 生成分享图片
    shareImageUrl = await useGenerateImage(canvas.value);

    // 弹窗广告
    try {
      // interstitialAd.value?.show();
    } catch (err) {
      //
    }
  }
});

const startPlay = () => {
  isPlaying.value = true;
  paint.value?.clear();
  localState?.title && uni.setNavigationBarTitle({ title: localState.title });
  paint.value?.setBackground(localState.background);
  paint.value?.playPath(localState.path, () => {
    isPlaying.value = false;
  });
};

const fetchData = (code: string) => {
  fetchPath({ code }).then((data) => {
    if (!data.length) {
      isPlaying.value = false;
      return uni.showToast({ title: '链接已失效~', icon: 'none' });
    }
    const { path, background = '#ffffff', code: _code, pwd } = data[0];
    localState = data[0];
    localState.path = _code ? path : pathFallback(path);
    localState.background = background

    if (pwd) {
      showDialog.value = true;
    } else {
      // 播放
      startPlay();
    }
  });
};

const codeRef = ref('');

onLoad(({ code }) => {
  if (code) {
    fetchData(code);
  } else {
    errorDialog.value = true;
  }
});

const handlePlayToggle = () => {
  if (paint.value?.isComplete) {
    startPlay();
  } else if (isPlaying.value) {
    paint.value?.pause();
    isPlaying.value = false;
  } else {
    if (localState?.path.length) {
      paint.value?.play();
      isPlaying.value = true;
    } else {
      handleGoPlay();
    }
  }
};

const handleGoPlay = () => {
  uni.reLaunch({ url: '/pages/index/index' });
};

const handleClick = (index: number | string) => {
  if (index !== 'mask') {
    if (!codeRef.value) {
      uni.showToast({ title: '请输入口令', icon: 'none' });
    } else if (codeRef.value !== localState?.pwd) {
      uni.showToast({ title: '口令不正确，请重新输入', icon: 'none' });
    } else {
      startPlay();
      showDialog.value = false;
    }
  }
};

const handleErrorClick = async () => {
  try {
    await uni.navigateBack({});
  } catch (err) {
    uni.reLaunch({ url: '/pages/index/index' });
  }
};

const safeBottom = ref(false);
</script>

<style lang="scss" scoped>
.preview-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 0;

  .icon-play {
    position: absolute;
    padding: 24rpx;
    left: 50%;
    top: 30%;
    transform: translateX(-50%);
    color: #fff;
    font-size: 88rpx;
  }

  .bottom {
    position: absolute;
    left: 32rpx;
    right: 32rpx;
    bottom: 32rpx;
    &.safeBottom {
      padding-bottom: 120rpx;
    }

    .btn {
      margin: 40rpx 0;
      padding: 18rpx 48rpx;
      color: #666;
      text-align: center;
      font-size: 36rpx;
      font-weight: bold;
      background-color: #fff;
      border-radius: 120rpx;
      box-shadow: $shadow;

      .iconfont {
        margin-left: 8rpx;
        font-size: inherit;
      }

      &:first-child {
        padding: 0 32rpx;
        color: var(--primaryColor);
      }
    }
  }
}

.tui-dialog input {
  margin: auto;
  padding: 24rpx;
  width: 60%;
  text-align: center;
  font-size: 32rpx;
  border-bottom: 1rpx solid rgba(0, 0, 0, 0.06);
}

.share-tips {
  position: absolute;
  padding: 24rpx 32rpx;
  top: 32rpx;
  left: 56rpx;
  right: 56rpx;
  text-align: center;
  color: #fff;
  font-size: 38rpx;
  font-weight: bold;
  border: 8rpx dashed;
  border-radius: 40%;
}
</style>
