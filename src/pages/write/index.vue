<template>
  <view class="page">
    <scroll-view class="scroll-view" scrollY>
      <canvas class="paper-canvas" canvas-id="paperCanvas"></canvas>
    </scroll-view>
    <view class="write-view" :style="{ color: store.themeColor, backgroundColor: store.themeBgColor }">
      <view class="tools-bar up">
        <view class="color-wrapper">
          <text class="color" v-for="(color, index) in store.colorList" :key="index" :style="{ backgroundColor: color.value }" @click="handleColorSelect(index)"></text>
        </view>
        <view class="button-wrapper">
          <text class="button xs material-symbols-outlined" :style="{ backgroundColor: store.backgroundColor }" @click="writeSignature.undo()">undo</text>
          <text class="button xs material-symbols-outlined" :style="{ backgroundColor: store.backgroundColor }">ink_eraser</text>
          <text class="button xs material-symbols-outlined" :style="{ backgroundColor: store.backgroundColor }">more_horiz</text>
        </view>
      </view>
      <scroll-view scrollX>
        <canvas
          class="write-canvas"
          canvas-id="writeCanvas"
          @touchstart="handleTouchStart"
          @touchmove="handleTouchMove"
          @touchend="handleTouchEnd"
          @touchcancel="handleTouchEnd"
        ></canvas>
      </scroll-view>
      <view class="tools-bar down">
        <view class="color-wrapper">
          <text class="color" v-for="(color, index) in store.bgColorList" :key="index" :style="{ backgroundColor: color.value }" @click="handleBgColorSelect(index)"></text>
        </view>
        <view class="button-wrapper">
          <text class="button next material-symbols-outlined" :style="{ backgroundColor: store.backgroundColor }">keyboard_return</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import Signature from 'mini-smooth-signature';
import { onMounted } from 'vue';
import { useStore } from '@/store';

const store = useStore();

let paperSignature;
let paperCtx: UniApp.CanvasContext;

let writeSignature;
let writeCtx: UniApp.CanvasContext;

function initSignature() {
  const { windowWidth, windowHeight } = uni.getSystemInfoSync();
  paperSignature = new Signature(paperCtx, {
    color: store.color,
    width: windowWidth * 5,
    height: windowHeight * 5,
    minWidth: 1,
    maxWidth: 4,
    scale: 0.2,
  });

  writeSignature = new Signature(writeCtx, {
    color: store.color,
    width: windowWidth * 5,
    height: 140,
    minWidth: 1,
    maxWidth: 4,
  });
}

onMounted(() => {
  paperCtx = uni.createCanvasContext('paperCanvas');
  writeCtx = uni.createCanvasContext('writeCanvas');

  // 初始化签字画布
  initSignature();

  // 绘制线条
  writeCtx.setStrokeStyle('#c5e1a5');
  writeCtx.setLineWidth(1);
  writeCtx.moveTo(0, 30);
  writeCtx.lineTo(writeSignature.width, 30);
  writeCtx.stroke();
  writeCtx.moveTo(0, 130);
  writeCtx.lineTo(writeSignature.width, 130);
  writeCtx.stroke();
  writeCtx.draw();
});

let disabledCanvas = false;

const handleTouchStart = (e) => {
  const pos = e.touches[0];
  disabledCanvas = pos.y < 30 || pos.y > 110;
  if (disabledCanvas) {
    return;
  }

  writeSignature.onDrawStart(pos.x, pos.y);

  // 缩放
  paperSignature.onDrawStart(pos.x, pos.y);
};

const handleTouchMove = (e) => {
  if (disabledCanvas) {
    return;
  }
  e.preventDefault();

  const pos = e.touches[0];
  writeSignature.onDrawMove(pos.x, pos.y);

  paperSignature.onDrawMove(pos.x, pos.y);
};

const handleTouchEnd = () => {
  if (disabledCanvas) {
    return;
  }

  writeSignature.onDrawEnd();

  paperSignature.onDrawEnd();
};

const handleColorSelect = (index: number) => {
  console.log('颜色选择', index);
  if (store.colorIndex === index) {
    // 颜色编辑
    uni.navigateTo({ url: '/pages/setting/color' });
  } else {
    store.setColorIndex(index);
  }

  initSignature();
};

const handleBgColorSelect = (index: number) => {
  if (store.backgroundColorIndex === index) {
    uni.navigateTo({ url: '/pages/setting/color?type=bg' });
  } else {
    store.setBackgroundColorIndex(index);
  }

  initSignature();
};
</script>

<style lang="scss" scoped>
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.scroll-view {
  height: 100vw;
  flex: 1;
  background-color: #fff;
}
.paper-canvas {
  width: 100vw;
  height: 100vh;
}

.write-view {
  position: relative;
  background-color: #f1f8e9;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, .05);
  border-radius: 12px 12px 0 0;

  .tools-bar {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 1;
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    pointer-events: none;
    &.down {
      margin-top: -20px;
      padding-top: 0;
      bottom: 0;
    }
    &.up {
      margin-bottom: -20px;
      padding-bottom: 0;
      top: 0;
    }
    .button {
      width: 44px;
      height: 32px;
      background-color: #ddd;
      border-radius: 4px;
      text-align: center;
      line-height: 32px;
      &.xs {
        height: 28px;
        width: 28px;
        font-size: 18px;
        line-height: 28px;
      }
    }
    .button + .button {
      margin-left: 8px;
    }

    .color-wrapper,
    .button-wrapper {
      display: flex;
      pointer-events: all;
    }

    .color {
      width: 16px;
      height: 16px;
      border-radius: 200px;
      & + .color {
        margin-left: 12px;
      }
    }
  }

  .write-canvas {
    margin: 16px 0 16px;
    width: 500vw;
    height: 160px;
  }
}
</style>
