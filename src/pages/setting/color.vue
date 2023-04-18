<template>
  <view class="container">
    <view class="row">
      <view class="label">{{ colorType === 'bg' ? '背景' : '画笔' }}颜色</view>
      <view class="list">
        <view class="item color-block" :class="{ selected: currentColorIndex === index }" :style="{ color: item.value }" v-for="(item, index) in colorList" :key="index" @click="handleColorSelect(index, item)"></view>
      </view>
    </view>
    <view class="bottom-line"></view>
    <mo-color-panel :value="currentColor" @change="onColorChange"></mo-color-panel>
  </view>
  <!-- 视频广告 -->
  <view class="video-ad">
    <ad class="ad" unit-id="adunit-f373a3a6ed2e650c" ad-type="video" ad-theme="white" :ad-intervals="30"></ad>
  </view>
</template>

<script lang="ts" setup>
import { ColorOption } from '@/store/types';
import { computed, ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { useStore } from '@/store';

const store = useStore();

const colorType = ref('color');
const currentColor = ref('#000');

onLoad(({ type = 'color' }) => {
  colorType.value = type;
  currentColor.value = type === 'bg' ? store.backgroundColor : store.color;
});

const colorList = computed(() => {
  return colorType.value === 'bg' ? store.bgColorList : store.colorList;
});

const currentColorIndex = computed(() => colorType.value === 'bg' ? store.backgroundColorIndex : store.colorIndex);

const handleColorSelect = (index: number, item: ColorOption) => {
  colorType.value === 'bg' ? store.setBackgroundColorIndex(index) : store.setColorIndex(index);
  currentColor.value = item.value;
};

const onColorChange = (v: any) => {
  console.log('color change', v);
  colorType.value === 'bg' ? store.editBackgroundColorByIndex({
    alpha: 1,
    value: v,
  }) : store.editColorListByIndex({
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

.bottom-line {
  margin: 32rpx 0;
  height: 1rpx;
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
  }
}

.video-ad {
  margin: 32rpx;
  overflow: hidden;
}
</style>
