<template>
  <view class="page">
    <button @click="onRender">渲染</button>
    <button @click="onRender2">渲染2</button>
    <button @click="onClick">生成动图</button>
    <video :src="vSrc"></video>
    <canvas id="cs" type="webgl"></canvas>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { showLoading } from '@/commons/utils';
import { onLoad } from '@dcloudio/uni-app';
import { createWebglRender, createVideo } from '@/commons/webgl';

const vSrc = ref('');

let canvas: any;
let render: any;

onLoad(() => {
  uni.createSelectorQuery().select('#cs').node(({ node }) => {
    canvas = node;
    canvas.width = 300;
    canvas.height = 150;

    render = createWebglRender(canvas);
  }).exec();
});

const imageArr: string[] = [];

['http://www.webgl3d.cn/threejs/%E5%87%A0%E4%BD%95%E4%BD%93Geometry.png', 'http://www.webgl3d.cn/threejs/%E6%9D%90%E8%B4%A8Material.png'].forEach(img => {
  uni.downloadFile({
    url: img,
    success: (res) => {
      imageArr.push(res.tempFilePath);
    },
  });
});

const onRender = async () => {
  render(imageArr[0]);
};

const onRender2 = async () => {
  render(imageArr[1]);
};

const onClick = async () => {
  showLoading('视频生成中...');

  const tempFilePath = await createVideo(new Array(120).fill(imageArr).flat(), {
    onProgress(progress) {
      console.log('--- 进度 ---', progress);
    },
  });

  uni.hideLoading();

  vSrc.value = tempFilePath;

  uni.saveVideoToPhotosAlbum({
    filePath: tempFilePath,
    success: () => {
      uni.showToast({ title: '保存成功！' });
    },
  });
}
</script>

<style lang="scss" scoped>
.page {
  padding: 24rpx;
}
</style>
