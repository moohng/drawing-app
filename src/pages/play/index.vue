<template>
  <canvas id="drawCanvas" type="2d" class="canvas" @click="handlePlayToggle" />
  <view class="preview-cover" v-if="!isPlaying">
    <text class="iconfont icon-play" @click="handlePlayToggle"></text>
    <view class="bottom">
      <view class="btn" @click="handleGoPlay">我也要玩~</view>
    </view>
  </view>
  <!-- 口令 -->
  <Dialog :visible="showDialog" title="请输入口令：" :buttons="['取消', '确定']" @click="handleClick">
    <input v-model="codeRef" type="text" placeholder="口令" />
  </Dialog>
  <!-- 异常 -->
  <Dialog :visible="errorDialog" title="数据异常！" :buttons="['确定']" @click="handleErrorClick"></Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { fetchPath } from '@/commons/api';
import { shareConfig } from '@/commons/config';
import { usePaint } from '@/uses';
import { pathFallback } from '@/commons/utils';
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { Path } from '@/store/types';

// 分享
onShareAppMessage(() => shareConfig);

// 分享朋友圈
onShareTimeline(() => shareConfig);

// 画笔
const paint = usePaint('#drawCanvas');

const isPlaying = ref(true);

const showDialog = ref(false);
const errorDialog = ref(false);

let localState: {
  title?: string;
  path: Path[];
  background: string;
  pwd: string;
};

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
    codeRef.value = code as string;
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
    paint.value?.play();
    isPlaying.value = true;
  }
};

const handleGoPlay = () => {
  uni.reLaunch({ url: '/pages/index/index' });
};

const handleClick = (index: number) => {
  if (index === 1) {
    if (!codeRef.value) {
      uni.showToast({ title: '请输入口令', icon: 'none' });
    } else if (codeRef.value !== localState?.pwd) {
      uni.showToast({ title: '口令不正确，请重新输入', icon: 'none' });
    } else {
      startPlay();
    }
  }
  showDialog.value = false;
};

const handleErrorClick = async () => {
  try {
    await uni.navigateBack({});
  } catch (err) {
    uni.reLaunch({ url: '/pages/index/index' });
  }
};
</script>

<style lang="scss" scoped>
.preview-cover {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: opacity 0.4s;
  background-color: rgba(44, 44, 44, .4);
  z-index: 0;
}

.preview-cover .share-img {
  width: 250px;
}

.preview-cover .icon-play {
  color: #fff;
  font-size: 44px;
}

.preview-cover .bottom {
  position: absolute;
  bottom: 40px;
  padding-bottom: env(safe-area-inset-bottom);
  padding-bottom: constant(safe-area-inset-bottom);
}

.preview-cover .bottom .btn {
  margin: 16px 0;
  padding: 8px 16px;
  color: #666;
  text-align: center;
  background-color: #fff;
  border-radius: 6px;
}

.preview-cover .bottom .btn:first-child {
  color: var(--primaryColor);
}

.tui-dialog input {
  padding: 8px 12px;
  text-align: left;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
