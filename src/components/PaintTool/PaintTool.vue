<template>
  <view class="left-aside">
    <!-- 画笔宽度 -->
    <view class="bar width-bar">
      <SelectButton :value="state.width" :options="widthList" @input="handleWidthSelect">
        <text class="iconfont icon-pen" :style="{ color: state.color }"></text>
        <template #select-item="{ item, checked }">
          <text
            class="icon"
            :data-checked="checked"
            :style="{ width: `${item.label}px`, height: `${item.label}px`, color: state.color }"
          ></text>
        </template>
      </SelectButton>
    </view>
    <!-- 颜色选择 -->
    <view class="bar color-bar">
      <SelectButton :value="state.color" :options="colorList" @input="handleColorSelect">
        <text class="iconfont icon-color" :style="{ color: state.color }"></text>
        <template #select-item="{ item, checked }">
          <text class="icon" :data-checked="checked" :style="{ color: item.value }"></text>
        </template>
      </SelectButton>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { useStore } from 'vuex';
import { TypeKeys } from '@/store/types';

const colorList = [
  { value: '#ffffff' },
  { value: '#000000' },
  { value: '#FF3333' },
  { value: '#0066FF' },
  { value: '#FFFF33' },
  { value: '#33CC66' },
];

const widthList = [
  { value: 2, label: 4 },
  { value: 4, label: 6 },
  { value: 6, label: 8 },
  { value: 12, label: 10 },
  { value: 20, label: 12 },
  { value: 30, label: 14 },
];

const { state, commit } = useStore();

const handleColorSelect = (value: string) => {
  commit(TypeKeys.SET_COLOR, value);
};

const handleWidthSelect = (value: string) => {
  commit(TypeKeys.SET_WIDTH, value);
};
</script>

<style lang="scss" scoped>
.left-aside {
  position: fixed;
  top: 32px;
  left: 12px;
  box-shadow: 0 1px 12px 0 rgba(#333, 0.06);
}

.bar {
  background-color: rgba($color: #dfdfdf, $alpha: 0.6);
}

.icon {
  padding: 4px;
  width: 14px;
  height: 14px;
  background-color: currentColor;
  background-clip: content-box;
  // z-index: -1;
  pointer-events: none;
  border-radius: 16px;
}

.color-bar .icon {
  box-shadow: 0 0 1px currentColor;
}

// .icon[data-checked='true'] {
//   box-shadow: 0 0 8px var(--primaryColor);
// }

.iconfont {
  font-size: 28px;
}
</style>
