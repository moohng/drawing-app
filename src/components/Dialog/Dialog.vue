<template>
  <view class="tui-dialog" v-if="show" :style="style">
    <view class="cover mask" @click="$emit('click', 'mask')"></view>
    <view class="tui-dialog__body">
      <view class="tui-dialog__hd">{{ title }}</view>
      <view class="tui-dialog__content">
        <slot>{{ content }}</slot>
      </view>
      <view class="tui-dialog__ft">
        <slot name="footer" :buttons="buttons">
          <view
            class="btn"
            v-for="(item, index) in buttons"
            :key="index"
            :style="(item as ButtonOption).style"
            @click="(item as ButtonOption).click?.() || emit('click', index, item)"
          >{{ (item as ButtonOption).name || item }}</view>
        </slot>
      </view>
    </view>
    <!-- 弹窗广告 -->
    <view class="bottom-ad" v-if="ad">
      <BottomAd :unit-id="typeof ad === 'string' ? ad : 'adunit-af124415d4eba99e'" />
    </view>
  </view>
</template>

<script lang="ts" setup>
import { CSSProperties, ref, watch } from 'vue';

interface ButtonOption {
  name: string;
  style?: CSSProperties;
  click?: () => void;
}

const props = defineProps<{
  visible: boolean;
  title?: string;
  content?: string;
  buttons?: string | ButtonOption[];
  ad?: string | boolean;
}>();

const { title, content, buttons, visible } = props;

const emit = defineEmits<{
  (event: 'click', index: number | string, item?: string | ButtonOption): void;
}>();

const initStyle = {
  opacity: visible ? 1 : 0,
}

const style = ref<CSSProperties>(initStyle);

const show = ref(visible);

let timer: number;

watch(() => props.visible,
  (value) => {
    if (value) {
      timer && clearTimeout(timer);
      show.value = true;
      setTimeout(() => {
        style.value = {};
      }, 10);
    } else {
      style.value = initStyle;
      timer = setTimeout(() => {
        show.value = false;
      }, 400);
    }
  }
);
</script>

<style lang="scss" scoped>
.tui-dialog {
  position: fixed;
  transition: all .2s;
  z-index: 9998;
}

.tui-dialog__body {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 620rpx;
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
  padding-left: 64rpx;
  padding-right: 64rpx;
  line-height: 1.6;
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

.bottom-ad {
  position: fixed;
  left: 32rpx;
  right: 32rpx;
  bottom: 32rpx;
  z-index: 9999;
}
</style>
