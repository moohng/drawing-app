<template>
  <!-- 画笔宽度 -->
  <view class="width-bar">
    <SelectButton v-model:value="state.width" :options="widthList">
      <template #default="{ item }">
        <text class="icon" :style="{ width: `${item.label}px`, height: `${item.label}px`, color: state.color }"></text>
      </template>
    </SelectButton>
  </view>
  <!-- 颜色选择 -->
  <view class="color-bar">
    <SelectButton v-model:value="state.color" :options="colorList">
      <template #default="{ item }">
        <text class="icon" :style="{ color: item.value }"></text>
      </template>
    </SelectButton>
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
  position: fixed;
  top: 32px;
  background-color: rgba($color: #efefef, $alpha: 0.6);
  box-shadow: 0 1px 12px 0 rgba(#333, 0.06);
  border-radius: 100px;
}

.color-bar {
  right: 12px;
}

.width-bar {
  left: 12px;
}

.list {
  display: flex;
  flex-direction: column;
  transition: height 0.4s;
  height: 0;
  overflow: hidden;
  box-sizing: border-box;

  &.open {
    height: 244px;
  }

  .item {
    position: relative;
    margin: 8px 0;
    width: 44px;
    text-align: center;

    radio {
      display: block;
      margin: 0;
      width: 100%;
      height: 22px;
      opacity: 0;

      + .icon {
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
        border-radius: 16px;
        // box-shadow: 0 0 1px currentColor;
      }
    }
    radio[data-checked='true'] + .icon {
      box-shadow: 0 0 8px var(--primaryColor);
    }
  }
}

.select-btn {
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.line {
  margin: 4px 8px;
  border-bottom: 1px solid #ddd;
}

.icon-line {
  display: inline-block;
  width: 22px;
  border-top: 2px solid;
  border-bottom: 6px solid;
  border-radius: 4px;
  &::before {
    content: '';
    display: block;
    margin: 3px 0;
    height: 4px;
    background-color: currentColor;
    border-radius: 4px;
  }
}
</style>
