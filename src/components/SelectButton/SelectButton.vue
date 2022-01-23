<template>
  <view class="select-button">
    <view class="button" @click="toggleExpand">
      <slot :expand="expand"></slot>
    </view>
    <view id="transBody" class="trans" :class="{ open: expand }">
      <radio-group class="list" @change="handleSelect">
        <!-- <view class="line"></view> -->
        <view class="item" v-for="(item, index) in props.options" :key="index" :data-checked="item.value == props.value">
          <radio class="radio" :value="String(item.value)" :checked="item.value == props.value" />
          <view class="inner">
            <slot name="select-item" :item="item" :checked="item.value == props.value"></slot>
          </view>
        </view>
      </radio-group>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { onReady } from '@dcloudio/uni-app';
import { getCurrentInstance, ref } from 'vue';

interface SelectButtonOption {
  label?: string;
  value: string | number;
}

const props = defineProps<{
  value: string | number;
  options: SelectButtonOption[];
  direction?: 'left' | 'right';
}>();

const emit = defineEmits<{
  (event: 'input', value: string): void;
}>();

const expand = ref(false);
let listWidth = 244;

onReady(() => {
  uni.createSelectorQuery().in(getCurrentInstance()).select('#transBody').boundingClientRect(({ width }) => {
    listWidth = width!;
  }).exec();
});

const toggleExpand = () => {
  expand.value = !expand.value;
};

const handleSelect = (e: any) => {
  emit('input', e.detail.value);
};
</script>

<style lang="scss" scoped>
.select-button {
  position: relative;
  display: flex;
  background-color: inherit;

  .button {
    width: 44px;
    height: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 100px;
  }

  .trans {
    position: absolute;
    left: 100%;
    top: 0;
    width: 0;
    transition: width 0.4s;
    background-color: inherit;
    overflow: hidden;
    border-radius: 0 100px 100px 0;

    &.open {
      width: 264px;
    }
  }
}

.list {
  display: flex;

  .item {
    position: relative;
    height: 44px;
    width: 44px;

    &[data-checked="true"] {
      background-color: rgba(red, 0.8);
    }

    .radio {
      display: block;
      margin: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      opacity: 0;
      z-index: 1;
    }

    .inner {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}

.line {
  margin: 8px 4px;
  border-left: 1px solid #ddd;
}
</style>
