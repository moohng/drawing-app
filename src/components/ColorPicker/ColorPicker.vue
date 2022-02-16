<template>
  <view class="color-picker">
    <!-- 颜色预览 -->
    <!-- <view>
      <view class="c-code">{{ hslaValue }}</view>
      <text class="iconfont icon-qiehuan"></text>
    </view> -->
    <!-- 对比度、亮度先择区域 -->
    <view class="color-sl" id="colorSL" :style="{ background: hColor }" @touchstart="onSLTouchStart" @touchmove.prevent="onSLTouchMove" @touchend="onSLTouchEnd" @touchcancel="onSLTouchEnd">
      <view class="h-bg">
        <view class="h-inner"></view>
      </view>
      <view class="sl-mark" :style="{ left: point.x + '%', top: point.y + '%' }"></view>
    </view>
    <!-- 色相、透明度选择 -->
    <view class="color-ha">
      <view class="trans-bg" style="margin-right: 16rpx;">
        <view class="color-preview" :style="{ backgroundColor: hslaValue }"></view>
      </view>
      <view class="color-ha-bd">
        <view class="h-bar hue" id="colorH" @touchstart="onHTouchStart" @touchmove="onHTouchMove" @touchend="onHTouchEnd" @touchcancel="onHTouchEnd">
          <view class="h-mark" :style="{ left: hOffset + '%' }"></view>
        </view>
        <view class="trans-bg" style="margin-top: 16rpx;">
          <view class="h-bar" id="colorA" :style="{ background: `linear-gradient(to right, ${hslValue}, ${hslValue.replace('rgb(', 'rgba(').replace(')', `,0)`)})` }" @touchstart="onATouchStart" @touchmove="onATouchMove" @touchend="onATouchEnd" @touchcancel="onATouchEnd">
            <view class="h-mark" :style="{ left: aOffset + '%' }"></view>
          </view>
        </view>
      </view>
    </view>
    <!-- 颜色格式转换 -->
    <view class="color-form"></view>
  </view>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { rgb, hex, hsv, hsl } from 'color-convert';
import { useAlpha, useHue, useRange, useSLRange } from './uses';
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

const onValueChanged = () => {
  emit('change', hslValue.value);
}

const { onSLTouchStart, onSLTouchMove, onSLTouchEnd, point, lValue, sValue } = useSLRange(onValueChanged);

const { onTouchStart: onHTouchStart, onTouchMove: onHTouchMove, onTouchEnd: onHTouchEnd, offset: hOffset } = useRange('#colorH', onValueChanged);
const { hValue, hColor } = useHue(hOffset);

const { onTouchStart: onATouchStart, onTouchMove: onATouchMove, onTouchEnd: onATouchEnd, offset: aOffset } = useRange('#colorA', onValueChanged);
const { aValue } = useAlpha(aOffset);

watch(() => props.value, (v) => {
  let defaultHSL: HSL = [0, 0, 0];
  if (/^#/.test(v)) {
    defaultHSL = hex.hsv(v);
  } else if (/^rgb/.test(v)) {
    defaultHSL = rgb.hsv(v.match(/\d+/g) as unknown as RGB);
  } else if (/^hsl/.test(v)) {
    defaultHSL = hsl.hsv(v.match(/\d+/g) as unknown as HSV);
  } else if (/^hsv/.test(v)) {
    defaultHSL = v.match(/\d+/g) as unknown as HSL;
  }

  console.log(v, '===> hsv', defaultHSL);

  hOffset.value = defaultHSL[0] / 3.6;
  aOffset.value = 0;
  point.x = defaultHSL[1];
  point.y = 100 - defaultHSL[2];
}, { immediate: true });

const hslValue = computed(() => {
  const [r, g, b] = hsv.rgb([hValue.value, sValue.value, lValue.value])
  return `rgb(${r},${g},${b})`;
});

const hslaValue = computed(() => {
  return hslValue.value.replace('rgb(', 'rgba(').replace(')', `,${aValue.value})`);
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
  display: flex;
  .color-preview {
    width: 76rpx;
    height: 76rpx;
  }
  .color-ha-bd {
    flex: 1;
  }
  .h-bar {
    position: relative;
    height: 30rpx;
    overflow: hidden;
    &.hue {
      background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%);
    }
    .h-mark {
      top: 50%;
    }
    + .h-bar {
      margin-top: 16rpx;
    }
  }
}

.color-preview {
  display: flex;
  align-items: center;

  .c-color {
    width: 50rpx;
    height: 50rpx;
  }
  .c-code {
    margin-left: 16rpx;
    color: $uni-text-color-grey;
    font-size: 28rpx;
  }
  .icon-qiehuan {
    margin-left: auto;
    font-size: 48rpx;
  }
}

.trans-bg {
  background-color: #fff;
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc);
  background-size: 16rpx 16rpx;
  background-position: 0 0, 8rpx 8rpx;
}

.color-form {
  margin-top: 32rpx;
}
</style>
