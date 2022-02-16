<template>
  <view class="container">
    <view class="row">
      <view class="label">常用颜色</view>
      <view class="list">
        <view class="item color-block" :class="{ selected: currentColorIndex === index }" :style="{ color: mergeColorByAlpha(item) }" v-for="(item, index) in colorList" :key="index" @click="handleColorSelect(index, item)"></view>
      </view>
    </view>
    <view class="border-line"></view>
    <ColorPicker :value="currentColor" @change="onColorChange"></ColorPicker>
    <!-- <view class="color-bar" :style="{ backgroundColor: `hsla(${hsl.h},${hsl.s}%,${hsl.l}%,${hsl.a})`}"></view> -->
    <!-- <view class="row">
      <view class="label">H</view>
      <slider class="slider" :value="hsl.h" :min="0" :max="360" :activeColor="getters.color" show-value :block-size="24" @changing="handleHSelect" @change="handleHSelectEnd"></slider>
    </view>
    <view class="row">
      <view class="label">S</view>
      <slider class="slider" :value="hsl.s" :min="0" :max="100" :activeColor="getters.color" show-value :block-size="24" @changing="handleSSelect" @change="handleSSelectEnd"></slider>
    </view>
    <view class="row">
      <view class="label">L</view>
      <slider class="slider" :value="hsl.l" :min="0" :max="100" :activeColor="getters.color" show-value :block-size="24" @changing="handleLSelect" @change="handleLSelectEnd"></slider>
    </view>
    <view class="row">
      <view class="label">A</view>
      <slider class="slider" :value="hsl.a" :min="0" :max="1" :step="0.01" :activeColor="getters.color" show-value :block-size="24" @changing="handleASelect" @change="handleASelectEnd"></slider>
    </view> -->
  </view>
</template>

<script lang="ts" setup>
import { ColorOption, TypeKeys } from '@/store/types';
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useStore } from 'vuex';
import { mergeColorByAlpha } from '@/commons/utils';

const { state, getters, commit } = useStore();

const colorType = ref('color');
const currentColor = ref('#000');

onLoad(({ type = 'color' }) => {
  colorType.value = type;
  currentColor.value = type === 'bg' ? getters.backgroundColor : getters.color;
});

const colorList = computed(() => {
  return colorType.value === 'bg' ? state.bgColorList : state.colorList;
});

const currentColorIndex = computed(() => colorType.value === 'bg' ? state.backgroundColorIndex : state.colorIndex);

const handleColorSelect = (index: number, item: ColorOption) => {
  commit(colorType.value === 'bg' ? TypeKeys.SET_BACKGROUND_COLOR_INDEX : TypeKeys.SET_COLOR_INDEX, index);
  currentColor.value = item.value;
};

const onColorChange = (v: any) => {
  console.log('color change', v);
  commit(colorType.value === 'bg' ? TypeKeys.EDIT_BACKGROUND_LIST_BY_INDEX : TypeKeys.EDIT_COLOR_LIST_BY_INDEX, {
    alpha: 1,
    value: v,
  });
};
</script>

<style lang="scss" scoped>
.container {
  margin: 32rpx;
  padding: 32rpx;
  background-color: $bgColor;
  border-radius: 32rpx;
}

.border-line {
  margin: 48rpx 0;
  border-bottom: 1rpx solid $uni-border-color;
}

.color-bar {
  height: 48rpx;
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
