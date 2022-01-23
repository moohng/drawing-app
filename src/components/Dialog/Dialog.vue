<template>
  <view class="tui-dialog" v-if="show" :style="style">
    <view class="cover mask" @click="$emit('click', 'mask')"></view>
    <view class="tui-dialog__body">
      <view class="tui-dialog__hd">{{ title }}</view>
      <view class="tui-dialog__content">
        <slot>{{ content }}</slot>
      </view>
      <view class="tui-dialog__ft">
        <view class="btn" v-for="(item, index) in buttons" :key="index" @click="$emit('click', index, item)">{{ item }}</view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps<{
  visible: boolean;
  title?: string;
  content?: string;
  buttons: string[];
}>();

const { title, content, buttons, visible } = props;

const emit = defineEmits<{
  (event: 'click', index: number | string, item?: string): void;
}>();

const style = ref<Record<string, string>>({
  opacity: '0',
  transform: 'scale(1.2)',
});
const show = ref(visible);

watch(() => props.visible,
  (value) => {
    if (value) {
      show.value = true;
      setTimeout(() => {
        style.value = {
          opacity: '1',
          transition: 'all .4s',
        };
      });
    } else {
      style.value = {
        opacity: '0',
        transform: 'scale(1.2)',
        transition: 'all .4s',
      };
      setTimeout(() => {
        show.value = false;
      }, 400);
    }
  }
);
</script>

<style lang="scss" scoped>
.tui-dialog {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tui-dialog__body {
  margin-top: -15%;
  width: 640rpx;
  max-width: 90%;
  line-height: 1.4;
  font-size: 32rpx;
  text-align: center;
  background-color: #fff;
  border-radius: 24rpx;
  overflow: hidden;
  z-index: 9999;
}

.tui-dialog__hd {
  padding: 64rpx 48rpx 32rpx;
  font-size: 36rpx;
  font-weight: bold;
}

.tui-dialog__content {
  margin-bottom: 64rpx;
  padding-left: 48rpx;
  padding-right: 48rpx;
}

.tui-dialog__ft {
  display: flex;
  position: relative;
  border-color: rgba(0,0,0,.06);
}

.tui-dialog__ft .btn {
  padding: 32rpx;
  flex: 1;
  font-weight: 700;
}

.tui-dialog__ft::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform-origin: 0 0;
  border-color: inherit;
  border-radius: inherit;
  pointer-events: none;
  border-top-style: solid;
  border-top-width: 1rpx;
}

.tui-dialog__ft .btn + .btn {
  position: relative;
  border-color: rgba(0,0,0,.06);
}

.tui-dialog__ft .btn + .btn::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  transform-origin: 0 0;
  border-color: inherit;
  border-radius: inherit;
  pointer-events: none;
  border-left-style: solid;
  border-left-width: 1rpx;
}

.tui-dialog .btn {
  color: #333;
  letter-spacing: 2rpx;
  text-decoration: none;
}
</style>
