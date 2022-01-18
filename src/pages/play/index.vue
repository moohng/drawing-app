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
import { usePaint, useShare } from '@/uses';
import { pathFallback } from '@/commons/utils';
import { onLoad } from '@dcloudio/uni-app';
import { Path } from '@/store/types';

// 分享
useShare();

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
