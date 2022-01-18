<template>
  <canvas id="drawCanvas" type="2d" class="canvas" @click="handlePlayToggle" />
  <view class="preview-cover" v-if="!isPlaying">
    <text class="iconfont icon-play" @click="handlePlayToggle"></text>
    <view class="bottom">
      <view class="btn" @click="handleGoPlay">我也要玩~</view>
      <view class="btn" @click="handlePwd">输入口令</view>
    </view>
  </view>
  <Dialog :visible="showDialog" title="请输入口令：" :buttons="['取消', '确定']" @click="handleClick">
    <input v-model="codeRef" type="text" placeholder="口令" />
  </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { fetchPath } from '@/commons/api';
import { usePaint } from '@/uses';
import { pathFallback } from '@/commons/utils';
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';
import { Path } from '@/store/types';

// 分享
onShareAppMessage(() => ({
  title: '【涂图了】让你笔尖动起来~',
  content: '找到一款神奇的绘图工具，快来体验一下吧！',
}));

// 分享朋友圈
onShareTimeline(() => ({
  title: '【涂图了】让你笔尖动起来~',
}));

// 画笔
const paint = usePaint('#drawCanvas');

const isPlaying = ref(true);
const showDialog = ref(false);

let localPath: Path[];

const startPlay = (path: Path[]) => {
  isPlaying.value = true;
  paint.value?.clear();
  paint.value?.playPath(path, () => {
    isPlaying.value = false;
  });
  localPath = path;
};

const fetchData = (code: string) => {
  fetchPath({ code }).then((data) => {
    if (!data.length) {
      isPlaying.value = false;
      return uni.showToast({ title: '链接已失效~', icon: 'none' });
    }
    const { path, background = '#ffffff', title, code: _code } = data[0];

    title && uni.setNavigationBarTitle({ title });
    paint.value?.setBackground(background);
    // 播放
    startPlay(_code ? path : pathFallback(path));
  });
};

const codeRef = ref('');

onLoad(({ code }) => {
  code && fetchData(code);
  codeRef.value = code as string;
});

const handlePlayToggle = () => {
  if (paint.value?.isComplete) {
    startPlay(localPath);
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

const handlePwd = () => {
  showDialog.value = true;
};

const handleClick = (index: number) => {
  if (index === 1) {
    if (!codeRef.value) {
      return uni.showToast({ title: '请输入一个口令', icon: 'none' });
    }
    fetchData(codeRef.value);
  }
  showDialog.value = false;
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
