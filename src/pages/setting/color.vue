<template>
  <view class="container">
    <view class="row">
      <view class="label">常用颜色</view>
      <view class="list">
        <view class="item color-block" :class="{ selected: currentColorIndex === index }" :style="{ color: item.value }" v-for="(item, index) in state.colorList" :key="index" @click="handleColorSelect(index, item.value)"></view>
      </view>
    </view>
    <view class="border-line"></view>
    <view class="row">
      <view class="label">H</view>
      <slider class="slider" :value="hsl.h" :min="0" :max="360" :activeColor="state.color" show-value :block-size="24" @changing="handleHSelect"></slider>
    </view>
    <view class="row">
      <view class="label">S</view>
      <slider class="slider" :value="hsl.s" :min="0" :max="100" :activeColor="state.color" show-value :block-size="24" @changing="handleSSelect"></slider>
    </view>
    <view class="row">
      <view class="label">L</view>
      <slider class="slider" :value="hsl.l" :min="0" :max="100" :activeColor="state.color" show-value :block-size="24" @changing="handleLSelect"></slider>
    </view>
    <view class="row">
      <view class="label">A</view>
      <slider class="slider" :value="hsl.a" :min="0" :max="100" :activeColor="state.color" show-value :block-size="24" @changing="handleASelect"></slider>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { TypeKeys } from '@/store/types';
import { reactive, ref, watch } from 'vue';
import { useStore } from 'vuex';

const { state, commit } = useStore();

const currentColorIndex = ref(state.colorList.findIndex(({ value }) => value === state.color));

const handleColorSelect = (index: number, color: string) => {
  currentColorIndex.value = index;
  commit(TypeKeys.SET_COLOR, color);
};

const hsl = reactive({
  h: 0,
  s: 0,
  l: 0,
  a: 100,
});

watch(hsl, (newHsl) => {
  const { h, s, l, a } = newHsl;
  const color = `hsla(${h},${s}%,${l}%,${a}%)`;
  commit(TypeKeys.EDIT_COLOR_LIST_BY_INDEX, {
    index: currentColorIndex.value,
    value: color,
  });
  commit(TypeKeys.SET_COLOR, color);
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
