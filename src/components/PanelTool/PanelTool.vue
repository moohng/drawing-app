<template>
  <view>
    <view class="row">
      <view class="label">笔宽</view>
      <slider class="slider" :value="state.width" :min="2" :max="40" :activeColor="state.color" show-value :block-size="24" @change="handleWidthSelect"></slider>
    </view>
    <view class="row">
      <view class="label">颜色</view>
      <view class="list">
        <view class="item" :class="{ selected: state.color === item.value }" :style="{ color: item.value }" v-for="(item, index) in colorList" :key="index" @click="handleColorSelect(item.value)"></view>
      </view>
    </view>
    <view class="row">
      <view class="label">背景</view>
      <view class="list">
        <view class="item" :class="{ selected: state.backgroundColor === item.value }" :style="{ color: item.value }" v-for="(item, index) in colorList" :key="index" @click="handleBgColorSelect(item.value)"></view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import { TypeKeys } from '@/store/types';
import { colorList } from '@/commons/config';

const { state, commit } = useStore();

const handleColorSelect = (value: string) => {
  commit(TypeKeys.SET_COLOR, value);
};

const handleBgColorSelect = (value: string) => {
  commit(TypeKeys.SET_BACKGROUND_COLOR, value);
};

const handleWidthSelect = (e: any) => {
  commit(TypeKeys.SET_WIDTH, e.detail.value);
};
</script>

<style lang="scss" scoped>
.row {
  margin: 24rpx 0;
  display: flex;
  align-items: center;
  white-space: nowrap;

  .label {
    margin-left: 32rpx;
    font-weight: bold;
  }

  .slider {
    flex: 1;
  }
}

.list {
  margin: 0 24rpx;
  display: flex;
  align-items: center;
  flex: 1;

  .item {
    margin-right: 16rpx;
    width: 76rpx;
    height: 76rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &::before {
      content: '';
      display: block;
      width: 48rpx;
      height: 48rpx;
      background-color: currentColor;
      border-radius: 200rpx;
      transition: all .4s;
    }

    &.selected::before {
      transform: scale(1.2);
      box-shadow: 0 0 12rpx 0;
    }
  }
}
</style>
