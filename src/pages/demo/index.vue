<template>
  <view class="page">
    <canvas id="cs" type="2d" @touchstart="onTouchStart"></canvas>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    onTouchStart() {
      uni.showToast({ title: 'touch start', icon: 'none' });
    },
  }
});
</script>

<style lang="scss" scoped>
.page {
  width: 100vw;
  height: 100vh;

  canvas {
    background-color: red;
  }
}
</style>
