<template>
  <canvas id="cs" canvas-id="cs" ref="cs" type="2d" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd"></canvas>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

let isPressed = false;

export default defineComponent({
  onReady() {
    const canvas = document.querySelector('.uni-canvas-canvas') as any;
    canvas.width = 500;
    canvas.height = 500;
    this.ctx = canvas.getContext('2d') as any;
    console.log(this.ctx)

    this.ctx.lineWidth = 6;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    const p1 = { x: 20, y: 20 };
    const p2 = { x: 200, y: 100 };
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.quadraticCurveTo(p1.x, p1.y, 20 + (200 - 20) / 2, 20 + (100 - 20) / 2);
    // this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
    this.ctx.restore();
  },
  methods: {
    onTouchStart(e: any) {
      uni.showToast({ title: 'touch start', icon: 'none' });
      isPressed = true;
    },
    onTouchMove(e: any) {
      if (!isPressed) return;
    },
    onTouchEnd(e: any) {
      isPressed = false;
    },
  }
});
</script>

<style lang="scss" scoped>
canvas {
  background-color: #e7e09bcc;
  width: 100vw;
  height: 100vw;
}
</style>
