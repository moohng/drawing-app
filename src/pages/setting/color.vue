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
  </view>
  <!-- 视频广告 -->
  <view class="video-ad">
    <view class="wrap">
      <ad unit-id="adunit-f373a3a6ed2e650c" ad-type="video" ad-theme="white" :ad-intervals="30"></ad>
      <!-- <ad unit-id="adunit-f373a3a6ed2e650c" ad-type="video" ad-theme="white" :ad-intervals="30"></ad> -->
    </view>
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
  padding: 16rpx 32rpx;
  background-color: $bgColor;
  border-radius: 32rpx;
  box-shadow: $shadow;
}

.border-line {
  margin: 32rpx 0;
  border-bottom: 1rpx solid $uni-border-color;
}

.row {
  margin: 24rpx 0;
  display: flex;
  align-items: center;
  white-space: nowrap;

  .label {
    margin-right: 36rpx;
    font-weight: bold;
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

.video-ad {
  margin: 32rpx;
  padding: 24rpx;
  background-color: #fff;
  box-shadow: $shadow;
  border-radius: 32rpx;

  .wrap {
    overflow: hidden;
  }
  ad + ad {
    margin-top: 16rpx;
  }
}
</style>
