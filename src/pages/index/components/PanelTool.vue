<template>
  <view>
    <view class="row">
      <view class="label">笔宽</view>
      <slider class="slider" :value="state.width" :min="1" :max="40" :activeColor="state.color" show-value :block-size="24" @change="handleWidthSelect"></slider>
    </view>
    <view class="row">
      <view class="label">颜色</view>
      <view class="list">
        <view class="item color-block" :class="{ selected: state.color === item.value }" :style="{ color: item.value }" v-for="(item, index) in state.colorList" :key="index" @click="handleColorSelect(item.value)"></view>
        <view class="item button" @click="handleRandomColor()">
          <text class="iconfont icon-config"></text>
        </view>
      </view>
    </view>
    <view class="row">
      <view class="label">背景</view>
      <view class="list">
        <view class="item color-block" :class="{ selected: state.backgroundColor === item.value }" :style="{ color: item.value }" v-for="(item, index) in state.bgColorList" :key="index" @click="handleBgColorSelect(item.value)"></view>
        <view class="item button" @click="handleRandomColor()">
          <text class="iconfont icon-config"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import { TypeKeys } from '@/store/types';

const { state, commit } = useStore();

const handleColorSelect = (value: string) => {
  if (state.color === value) {
    // 颜色编辑
    uni.navigateTo({ url: '/pages/setting/color' });
  } else {
    commit(TypeKeys.SET_COLOR, value);
  }
};

const handleBgColorSelect = (value: string) => {
  commit(TypeKeys.SET_BACKGROUND_COLOR, value);
};

const handleWidthSelect = (e: any) => {
  commit(TypeKeys.SET_WIDTH, e.detail.value);
};

const handleRandomColor = () => {
  uni.navigateTo({ url: '/pages/setting/color' });
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

    &.button {
      margin-left: 8rpx;
      .iconfont {
        font-size: 56rpx;
      }
    }
  }
}
</style>
