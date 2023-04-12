<template>
  <view class="page">
    <button @click="onClick">生成动图</button>
    <video :src="currentGif"></video>
  </view>
</template>

<script setup>
import { ref } from 'vue';
import { createScopedThreejs } from 'threejs-miniprogram';
import { Paint } from '@/commons/Paint';
import { generalBgColor } from '@/commons/utils';

const currentGif = ref('');

const onClick = async () => {
  console.log('------ click ----');

  const canvas = wx.createOffscreenCanvas({ type: 'webgl', width: 200, height: 200 });

  const THREE = createScopedThreejs(canvas);

  // const ctx = canvas.getContext('webgl');
  // const paint = new Paint(ctx, canvas);
  // paint.setBackground(generalBgColor());

  console.log('===', ctx);

  // 创建 mediaRecorder
  const fps = 2;
  const recorder = wx.createMediaRecorder(canvas, {
    fps,
  });

  // 启动 mediaRecorder
  await recorder.start();

  console.log('---- start ----')

  // 绘制
  ctx.clearColor(1, 0, 0, 1);
  ctx.clear(ctx.COLOR_BUFFER_BIT);
  await recorder.requestFrame();

  ctx.clearColor(1, 1, 0, 1);
  ctx.clear(ctx.COLOR_BUFFER_BIT);
  await recorder.requestFrame();

  console.log('---- requestFrame ----')

  // 绘制完成，生成视频
  const { tempFilePath } = await recorder.stop();

  console.log('---- video ----', tempFilePath);

  currentGif.value = tempFilePath;

  recorder.destroy();
}
</script>

<style lang="scss" scoped>
.page {
  padding: 24rpx;
}
</style>
