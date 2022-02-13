<template>
  <view class="container">
    <view class="row">
      <view class="label">常用颜色</view>
      <view class="list">
        <view class="item color-block" :class="{ selected: state.colorIndex === index }" :style="{ color: item.value }" v-for="(item, index) in state.colorList" :key="index" @click="handleColorSelect(index, item)"></view>
      </view>
    </view>
    <view class="border-line"></view>
    <view class="row">
      <view class="label">H</view>
      <slider class="slider" :value="hsl.h" :min="0" :max="360" :activeColor="getters.color" show-value :block-size="24" @changing="handleHSelect"></slider>
    </view>
    <view class="row">
      <view class="label">S</view>
      <slider class="slider" :value="hsl.s" :min="0" :max="100" :activeColor="getters.color" show-value :block-size="24" @changing="handleSSelect"></slider>
    </view>
    <view class="row">
      <view class="label">L</view>
      <slider class="slider" :value="hsl.l" :min="0" :max="100" :activeColor="getters.color" show-value :block-size="24" @changing="handleLSelect"></slider>
    </view>
    <view class="row">
      <view class="label">A</view>
      <slider class="slider" :value="hsl.a" :min="0" :max="1" :step="0.01" :activeColor="getters.color" show-value :block-size="24" @changing="handleASelect"></slider>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ColorOption, TypeKeys } from '@/store/types';
import { reactive, watch } from 'vue';
import { useStore } from 'vuex';
import { rgb as convertRgb, hsl as convertHsl } from 'color-convert';
import { RGB } from 'color-convert/conversions';

const { state, getters, commit } = useStore();

const handleColorSelect = (index: number, item: ColorOption) => {
  commit(TypeKeys.SET_COLOR_INDEX, index);
  const [h, s, l] = convertRgb.hsl(item.value.match(/\d+/g) as unknown as RGB);
  hsl.h = h;
  hsl.s = s;
  hsl.l = l;
  hsl.a = item.alpha || 1;
};

// 初始化
const [h, s, l] = convertRgb.hsl(getters.color.match(/\d+/g));

const hsl = reactive({
  h,
  s,
  l,
  a: getters.alpha,
});

watch(hsl, (newHsl) => {
  const { h, s, l, a } = newHsl;
  const [r, g, b] = convertHsl.rgb([h, s, l]);
  const color = `rgb(${r},${g},${b})`;
  commit(TypeKeys.EDIT_COLOR_LIST_BY_INDEX, {
    alpha: a || 1,
    value: color,
  });
});

const handleHSelect = (e: any) => {
  hsl.h = e.detail.value;
};
const handleSSelect = (e: any) => {
  hsl.s = e.detail.value;
};
const handleLSelect = (e: any) => {
  hsl.l = e.detail.value;
};
const handleASelect = (e: any) => {
  hsl.a = e.detail.value;
};
</script>

<style lang="scss" scoped>
.container {
  padding: 32rpx 64rpx;
}

.border-line {
  margin: 48rpx 0;
  border-bottom: 1rpx solid $uni-border-color;
}

.row {
  margin: 32rpx 0;
  display: flex;
  align-items: center;
  white-space: nowrap;

  .label {
    margin-right: 36rpx;
    font-weight: bold;
  }

  .slider {
    flex: 1;
  }
}

.list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;

  .item {
    width: 76rpx;
    height: 76rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &.color-block::before {
      content: '';
      display: block;
      width: 48rpx;
      height: 48rpx;
      background-color: currentColor;
      border-radius: 200rpx;
      transition: all .4s;
    }

    &.color-block.selected::before {
      transform: scale(1.4);
      box-shadow: 0 0 8rpx 0;
    }
  }
}
</style>
