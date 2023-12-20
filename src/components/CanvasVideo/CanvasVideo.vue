<template>
  <view class="canvas-video" @click="handlePlayToggle">
    <view class="video-bg" :style="coverStyle"></view>
    <canvas class="canvas" :style="{ opacity: paint ? 1 : 0, background }" id="drawCanvas" canvasId="drawCanvas" type="2d" />
    <view class="mask cover" v-if="!isPlaying">
      <text class="iconfont icon-play"></text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { usePaint } from '@/commons/Paint';
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
  coverImage: {
    type: String,
    default: '',
  },
});

const emit = defineEmits<{
  (event: 'change', isPlay: boolean): void;
}>();

const coverStyle = computed(() => {
  return props.coverImage ? {
    backgroundImage: `url(${props.coverImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)',
  } : {};
});

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
  overflow: hidden;

  .video-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: #000;
    z-index: 0;
  }

  .canvas {
    margin: auto;
    width: 75%;
    height: 780rpx;
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
}
</style>
