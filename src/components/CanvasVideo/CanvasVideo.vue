<template>
  <view class="canvas-video">
    <canvas class="canvas" :style="{ opacity: paint ? 1 : 0 }" id="drawCanvas" canvasId="drawCanvas" type="2d" @click="handlePlayToggle" />
    <view class="mask cover" v-if="!isPlaying" @click="handlePlayToggle">
      <text class="iconfont icon-play"></text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { usePaint } from '@/uses';
import { Path } from '@/store/types';

const props = defineProps({
  path: {
    type: Array,
    default: () => [],
  },
  background: {
    type: String,
    default: '#fff',
  },
});

const isPlaying = ref(true);

const paint = usePaint('drawCanvas');

const startPlay = () => {
  isPlaying.value = true;
  paint.value?.clear();
  paint.value?.setBackground(props.background);
  paint.value?.playPath(props.path as Path[], () => {
    isPlaying.value = false;
  });
};

const handlePlayToggle = () => {
  if (paint.value?.isComplete) {
    startPlay();
  } else if (isPlaying.value) {
    paint.value?.pause();
    isPlaying.value = false;
  } else {
    if (props.path.length) {
      paint.value?.play();
      isPlaying.value = true;
    }
  }
};

onMounted(() => {
  setTimeout(startPlay, 1000);
});
</script>

<style lang="scss" scoped>
.canvas-video {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  .canvas {
    margin: auto;
    width: 50%;
    height: 100%;
  }
  .mask.cover {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon-play {
      color: #ccc;
      font-size: 64rpx;
    }
  }
}
</style>
