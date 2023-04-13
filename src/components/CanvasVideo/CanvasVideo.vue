<template>
  <view class="canvas-video" @click="handlePlayToggle">
    <!-- <canvas class="bg-canvas" id="bgCanvas" canvasId="bgCanvas" type="2d"></canvas> -->
    <canvas class="canvas" :style="{ opacity: paint ? 1 : 0, background }" id="drawCanvas" canvasId="drawCanvas" type="2d" />
    <view class="mask cover" v-if="!isPlaying">
      <text class="iconfont icon-play"></text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
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

const emit = defineEmits<{
  (event: 'change', isPlay: boolean): void;
}>();

const isPlaying = ref(true);

watch(isPlaying, (isPlay) => {
  emit('change', isPlay);
});

const { paint } = usePaint('drawCanvas');

const startPlay = async () => {
  isPlaying.value = true;
  paint.value?.clear();

  await paint.value?.playPath({
    path: props.path as Path[],
  });

  isPlaying.value = false;
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
  setTimeout(() => {
    startPlay();
  }, 1000);
});
</script>

<style lang="scss" scoped>
.canvas-video {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #000;
  overflow: hidden;
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
    background-color: rgba(0, 0, 0, 0.3);
    .icon-play {
      color: #ccc;
      font-size: 64rpx;
    }
  }
  // .bg-canvas {
  //   position: absolute;
  //   left: 0;
  //   width: 100vw;
  //   height: 100vh;
  //   top: 50%;
  //   transform: translateY(-50%);
  //   z-index: -1;
  // }
}
</style>
