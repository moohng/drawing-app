<template>
  <view class="select-button">
    <view class="button" @click="toggleExpand">
      <text class="icon-line"></text>
    </view>
    <radio-group class="list" :class="{ open: expand }" @change="handleSelect">
      <view class="item" v-for="(item, index) in options" :key="index">
        <radio :value="String(item.value)" :checked="item.value === value" :data-checked="item.value == value" />
        <slot :item="item"></slot>
      </view>
    </radio-group>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface SelectButtonOption {
  label?: string;
  value: string | number;
}

const props = defineProps<{
  value: string | number;
  options: SelectButtonOption[];
}>();

const emit = defineEmits<{
  (event: 'input', value: string): void;
}>();

const { value, options } = props;

const expand = ref(false);

const toggleExpand = () => {
  expand.value = !expand.value;
};

const handleSelect = (e: any) => {
  emit('input', e.detail.value);
};
</script>

<style lang="scss" scoped>
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

.button {
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
