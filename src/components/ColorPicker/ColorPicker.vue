<template>
  <view class="color-picker">
    <!-- 对比度、亮度先择区域 -->
    <view class="color-sl" id="colorSL" :style="{ background: hColor }" @touchstart="onSLTouchStart" @touchmove.prevent="onSLTouchMove" @touchend="onSLTouchEnd" @touchcancel="onSLTouchEnd">
      <view class="h-bg">
        <view class="h-inner"></view>
      </view>
      <view class="sl-mark" :style="{ left: point.x + '%', top: point.y + '%' }"></view>
    </view>
    <!-- 色相、透明度选择 -->
    <view class="color-ha">
      <view class="h-bar" id="colorH" @touchstart="onHTouchStart" @touchmove="onHTouchMove" @touchend="onHTouchEnd" @touchcancel="onHTouchEnd">
        <view class="h-mark" :style="{ left: hOffset + '%' }"></view>
      </view>
    </view>
    <!-- 颜色格式转换 -->
    <view class="color-form" :style="{ backgroundColor: hsla }">

    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref, watch, watchEffect } from 'vue';
import { rgb, hex, hsv } from 'color-convert';
import { useHRange, useSLRange } from './uses';
import { HSL, HSV, RGB } from 'color-convert/conversions';

const props = defineProps({
  value: {
    type: String,
    default: '#000',
  },
});

const emit = defineEmits<{
  (event: 'change', value: string): void;
}>();

const { onSLTouchStart, onSLTouchMove, onSLTouchEnd, point, lValue, sValue } = useSLRange();

const { onHTouchStart, onHTouchMove, onHTouchEnd, hValue, hOffset, hColor } = useHRange();

watch(() => props.value, (v) => {
  let defaultHSL: HSL = [0, 0, 0];
  if (/^#/.test(v)) {
    defaultHSL = hex.hsl(v);
  } else if (/^rgb/.test(v)) {
    defaultHSL = rgb.hsl(v.match(/\d+/g) as unknown as RGB);
  } else if (/^hsv/.test(v)) {
    defaultHSL = hsv.hsl(v.match(/\d+/g) as unknown as HSV);
  } else if (/^hsl/.test(v)) {
    defaultHSL = v.match(/\d+/g) as unknown as HSL;
  }

  hOffset.value = defaultHSL[0] / 3.6;
  point.x = defaultHSL[1];
  point.y = 100 - defaultHSL[2];
}, { immediate: true });

const hsla = computed(() => {
  const [r, g, b] = hsv.rgb([hValue.value, sValue.value, lValue.value])
  return `rgb(${r},${g},${b})`;
});

watch(hsla, (value) => {
  emit('change', value);
});
</script>

<style lang="scss" scoped>
.color-sl {
  position: relative;
  height: 300rpx;
  overflow: hidden;

  .h-bg {
    height: 100%;
    background: linear-gradient(to right, #fff, rgba(255, 255, 255, 0));
    .h-inner {
      height: 100%;
      background: linear-gradient(to top, #000, rgba(0, 0, 0, 0));
    }
  }

  .sl-mark {
    top: 0;
  }
}

[class*="-mark"] {
  position: absolute;
  width: 16rpx;
  height: 16rpx;
  border: 4rpx solid #fff;
  border-radius: 100%;
  box-shadow: 0 0 4rpx 0 rgba(0, 0, 0, 1), inset 0 0 2rpx 0 rgba(0, 0, 0, 1);
  transform: translate(-50%, -50%);
}

.color-ha {
  margin-top: 16rpx;
  .h-bar {
    position: relative;
    height: 30rpx;
    background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    overflow: hidden;
    .h-mark {
      top: 50%;
    }
  }
}

.color-form {
  margin-top: 32rpx;
  height: 50rpx;
}
</style>
