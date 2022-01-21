<template>
  <!-- 颜色选择 -->
  <radio-group class="color-bar" @change="handleColorSelect">
    <view class="button" v-for="(color, index) in colorList" :key="index">
      <radio :value="color" :checked="state.color === color" />
      <text class="icon" :style="{ color }"></text>
    </view>
  </radio-group>

  <!-- 画笔宽度 -->
  <radio-group class="width-bar" @change="handleWidthSelect">
    <view class="button" v-for="(item, index) in widthList" :key="index">
      <radio :value="String(item.value)" :checked="item.value === state.width" />
      <text class="icon" :style="{ width: `${item.width}px`, height: `${item.width}px`, color: state.color }"></text>
    </view>
  </radio-group>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import { TypeKeys } from '@/store/types';

const colorList = ['#ffffff', '#000000', '#FF3333', '#0066FF', '#FFFF33', '#33CC66'];

const widthList = [
  { value: 2, width: 4 },
  { value: 4, width: 6 },
  { value: 6, width: 8 },
  { value: 12, width: 10 },
  { value: 20, width: 12 },
  { value: 30, width: 14 },
];

const { state, commit } = useStore();

const handleColorSelect = (e: any) => {
  commit(TypeKeys.SET_COLOR, e.detail.value);
};

const handleWidthSelect = (e: any) => {
  commit(TypeKeys.SET_WIDTH, e.detail.value);
};
</script>

<style lang="scss" scoped>
.color-bar,
.width-bar {
  padding: 8px 0;
  position: fixed;
  top: 35%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  background-color: rgba($color: #efefef, $alpha: 0.6);
  border-radius: 100px;
  box-shadow: 0 1px 12px 0 rgba(#333, 0.06);
}

.color-bar {
  right: 12px;
}

.width-bar {
  left: 12px;
}

.color-bar .button,
.width-bar .button {
  position: relative;
  margin: 8px 0;
  width: 44px;
  text-align: center;
}

.button radio {
  display: block;
  margin: 0;
  width: 100%;
  height: 22px;
  opacity: 0;
}

.button radio + .icon {
  padding: 4px;
  position: absolute;
  top: 0;
  left: 50%;
  width: 14px;
  height: 14px;
  transform: translateX(-50%);
  background-color: currentColor;
  background-clip: content-box;
  z-index: -1;
  pointer-events: none;
}

.button radio + .icon {
  border-radius: 16px;
}

.button radio[aria-checked='true'] + .icon,
.color-bar .button radio[aria-checked='true'] + .icon {
  box-shadow: 0 0 8px var(--primaryColor);
}

.color-bar .button radio + .icon {
  box-shadow: 0 0 1px currentColor;
}

.line {
  margin: 4px 8px;
  border-bottom: 1px solid #ddd;
}
</style>
