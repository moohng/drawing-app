<template>
  <view class="panel-tool">
    <view class="row">
      <view class="label">大小</view>
      <slider class="slider" :value="state.width" :min="1" :max="20" :activeColor="getters.themeColor" backgroundColor="#ffffff" show-value :block-size="24" @change="handleWidthSelect"></slider>
    </view>
    <view class="row">
      <view class="label">颜色</view>
      <view class="list">
        <view class="item color-block" :class="{ selected: state.colorIndex === index }" :style="{ color: item.value }" v-for="(item, index) in state.colorList" :key="index" @click="handleColorSelect(index)"></view>
        <view class="item button" @click="handleConfigColor('color')">
          <text class="iconfont icon-config"></text>
        </view>
      </view>
    </view>
    <view class="row">
      <view class="label">背景</view>
      <view class="list">
        <view class="item color-block" :class="{ selected: state.backgroundColorIndex === index }" :style="{ color: item.value }" v-for="(item, index) in state.bgColorList" :key="index" @click="handleBgColorSelect(index)"></view>
        <view class="item button" @click="handleConfigColor('bg')">
          <text class="iconfont icon-config"></text>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import { TypeKeys } from '@/store/types';

const { state, getters, commit } = useStore();

const handleColorSelect = (index: number) => {
  if (state.colorIndex === index) {
    // 颜色编辑
    uni.navigateTo({ url: '/pages/setting/color' });
  } else {
    commit(TypeKeys.SET_COLOR_INDEX, index);
  }
};

const handleBgColorSelect = (index: number) => {
  if (state.backgroundColorIndex === index) {
    uni.navigateTo({ url: '/pages/setting/color?type=bg' });
  } else {
    commit(TypeKeys.SET_BACKGROUND_COLOR_INDEX, index);
  }
};

const handleWidthSelect = (e: any) => {
  commit(TypeKeys.SET_WIDTH, e.detail.value);
};

const handleConfigColor = (type = 'color') => {
  uni.navigateTo({ url: '/pages/setting/color?type=' + type });
};
</script>

<style lang="scss" scoped>
.panel-tool {
  padding: 8rpx 0;
}

.row {
  margin: 16rpx 0;
  display: flex;
  align-items: center;
  white-space: nowrap;

  .label {
    margin-left: 32rpx;
    font-weight: bold;
  }

  .slider {
    margin: 12rpx 56rpx;
    flex: 1;
  }
}

.list {
  margin-left: 28rpx;
  display: flex;
  align-items: center;
  flex: 1;

  .item {
    margin-right: 20rpx;
    width: 72rpx;
    height: 72rpx;
    display: flex;
    align-items: center;
    justify-content: center;

    &.color-block::before {
      content: '';
      display: block;
      width: 36rpx;
      height: 36rpx;
      background-color: currentColor;
      border-radius: 200rpx;
      transition: all .4s;
    }

    &.color-block.selected::before {
      transform: scale(1.6);
      box-shadow: $shadow;
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
