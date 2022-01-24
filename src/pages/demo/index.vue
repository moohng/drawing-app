<template>
  <canvas id="cs" canvas-id="cs" type="2d" @touchstart="onTouchStart"></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  onReady() {
    const ctx = uni.createCanvasContext('cs', this);

    ctx.setFillStyle('red')
    ctx.fillRect(10, 10, 150, 75)
    ctx.draw()
  },
  methods: {
    onTouchStart() {
      uni.showToast({ title: 'touch start', icon: 'none' });
    },
  }
});
</script>

<style lang="scss" scoped>
canvas {
  // background-color: red;
}
</style>
