<template>
  <view class="color-panel">
    <!-- 对比度、亮度先择区域 -->
    <view class="color-sl" id="colorSL" :style="{ background: hColor }" @touchstart="onSLTouchStart" @touchmove.prevent="onSLTouchMove" @touchend="onSLTouchEnd" @touchcancel="onSLTouchEnd">
      <view class="h-bg">
        <view class="h-inner"></view>
      </view>
      <view class="mark sl-mark" :style="{ left: point.x + '%', top: point.y + '%' }"></view>
    </view>
    <!-- 色相、透明度选择 -->
    <view class="color-ha">
      <view class="trans-bg" style="margin-right: 16rpx;">
        <view class="color-preview" :style="{ backgroundColor: hslaValue }"></view>
      </view>
      <view class="color-ha-bd">
        <view class="h-bar hue" id="colorH" @touchstart="onHTouchStart" @touchmove="onHTouchMove" @touchend="onHTouchEnd" @touchcancel="onHTouchEnd">
          <view class="mark h-mark" :style="{ left: hOffset + '%' }"></view>
        </view>
        <view class="trans-bg" style="margin-top: 16rpx;">
          <view class="h-bar" id="colorA" :style="{ background: `linear-gradient(to right, ${hslValue.replace('rgb(', 'rgba(').replace(')', `,0)`)}, ${hslValue})` }" @touchstart="onATouchStart" @touchmove="onATouchMove" @touchend="onATouchEnd" @touchcancel="onATouchEnd">
            <view class="mark h-mark" :style="{ left: aOffset + '%' }"></view>
          </view>
        </view>
      </view>
    </view>
    <!-- 颜色格式转换 -->
    <view class="color-form">
      <view class="form-body col-3" v-if="mode === MODE.RGB">
        <view class="field">
          <input class="input" :value="form.r" type="number" @blur="onInputChange('r', $event)" @confirm="onInputChange('r', $event)">
          <view class="label">R</view>
        </view>
        <view class="field">
          <input class="input" :value="form.g" type="number" @blur="onInputChange('g', $event)" @confirm="onInputChange('g', $event)">
          <view class="label">G</view>
        </view>
        <view class="field">
          <input class="input" :value="form.b" type="number" @blur="onInputChange('b', $event)" @confirm="onInputChange('b', $event)">
          <view class="label">B</view>
        </view>
        <view class="field">
          <input class="input" :value="form.a" type="number" @blur="onInputChange('a', $event)" @confirm="onInputChange('a', $event)">
          <view class="label">A</view>
        </view>
      </view>
      <view class="form-body col-3" v-else-if="mode === MODE.HSL">
        <view class="field">
          <input class="input" :value="form.h" type="number" @blur="onInputChange('h', $event)" @confirm="onInputChange('h', $event)">
          <view class="label">H</view>
        </view>
        <view class="field">
          <input class="input" :value="form.s" type="number" @blur="onInputChange('s', $event)" @confirm="onInputChange('s', $event)">
          <view class="label">S</view>
        </view>
        <view class="field">
          <input class="input" :value="form.l" type="number" @blur="onInputChange('l', $event)" @confirm="onInputChange('l', $event)">
          <view class="label">L</view>
        </view>
        <view class="field">
          <input class="input" :value="form.a" type="number" @blur="onInputChange('a', $event)" @confirm="onInputChange('a', $event)">
          <view class="label">A</view>
        </view>
      </view>
      <view class="form-body" v-else>
        <view class="field">
          <input class="input" :value="form.hex" type="text" @blur="onInputChange('hex', $event)" @confirm="onInputChange('hex', $event)">
          <view class="label">HEX</view>
        </view>
      </view>
      <text class="iconfont icon-qiehuan" @click="onSwitch"></text>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { computed, watch } from 'vue';
import { hsv } from 'color-convert';
import { MODE, useAlpha, useHue, useModeSwitch, useRange, useSLRange } from './uses';
import { toHSVA } from './tools';

const props = defineProps({
  value: {
    type: String,
    default: '#000',
  },
});

const emit = defineEmits<{
  (event: 'update:value', value: string): void;
}>();

// 触发change事件
const onValueChanged = () => {
  emit('update:value', hslaValue.value);
}

const { onSLTouchStart, onSLTouchMove, onSLTouchEnd, point, lValue, sValue } = useSLRange(onValueChanged);

const { onTouchStart: onHTouchStart, onTouchMove: onHTouchMove, onTouchEnd: onHTouchEnd, offset: hOffset } = useRange('#colorH', onValueChanged);
const { hValue, hColor } = useHue(hOffset);

const { onTouchStart: onATouchStart, onTouchMove: onATouchMove, onTouchEnd: onATouchEnd, offset: aOffset } = useRange('#colorA', onValueChanged);
const { aValue } = useAlpha(aOffset);

const setDefaultValue = (v: string) => {
  const { hsv: defaultHSV, alpha: defaultAlpha } = toHSVA(v);

  console.log(v, '===> hsv', defaultHSV, defaultAlpha);

  hOffset.value = defaultHSV[0] / 3.6;
  aOffset.value = defaultAlpha * 100;
  point.x = defaultHSV[1];
  point.y = 100 - defaultHSV[2];
}

// 设置默认值（颜色面板）
watch(() => props.value, (v) => {
  setDefaultValue(v);
}, { immediate: true });

const hslValue = computed(() => {
  const [r, g, b] = hsv.rgb([hValue.value, sValue.value, lValue.value])
  return `rgb(${r},${g},${b})`;
});

const hslaValue = computed(() => {
  return hslValue.value.replace('rgb(', 'rgba(').replace(')', `,${aValue.value})`);
});

/** 模式切换 */
const { mode, form, onSwitch } = useModeSwitch(hslValue, aValue);

const onInputChange = (key: keyof typeof form, e: any) => {
  let { value } = e.detail;
  console.log('onInputChange', key, value);
  if (key !== 'hex') {
    value = parseInt(value);
    if (value < 0) {
      value = 0;
    } else if (['r', 'g', 'b'].includes(key) && value > 255) {
      value = 255;
    } else if (['s', 'l'].includes(key) && value > 100) {
      value = 100;
    } else if (key === 'h' && value > 360) {
      value = 360;
    } else if (key === 'a' && value > 1) {
      value = 1;
    }
  } else {
    value = value.toUpperCase();
    if (!/^#/.test(value)) {
      value = '#' + value;
    }
  }
  form[key] = value as never;

  if (mode.value === MODE.RGB) {
    const { r, g, b, a } = form;
    setDefaultValue(`rgba(${r},${g},${b},${a})`);
  } else if (mode.value === MODE.HSL) {
    const { h, s, l, a } = form;
    setDefaultValue(`hsla(${h},${s},${l},${a})`);
  } else {
    setDefaultValue(form.hex);
  }

  onValueChanged();
};
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

.mark {
  position: absolute;
  width: 16rpx;
  height: 16rpx;
  border: 6rpx solid #fff;
  border-radius: 100%;
  box-shadow: 0 0 4rpx 0 rgba(0, 0, 0, 1), inset 0 0 2rpx 0 rgba(0, 0, 0, 1);
  transform: translate(-50%, -50%);
}

.color-ha {
  margin-top: 16rpx;
  display: flex;
  .color-preview {
    width: 96rpx;
    height: 96rpx;
  }
  .color-ha-bd {
    flex: 1;
  }
  .h-bar {
    position: relative;
    height: 40rpx;
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

.trans-bg {
  background-color: #fff;
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc);
  background-size: 16rpx 16rpx;
  background-position: 0 0, 8rpx 8rpx;
}

.color-form {
  margin-top: 32rpx;
  display: flex;
  align-items: center;

  .form-body {
    flex: 1;
    display: flex;
    justify-content: center;
  }

  .icon-qiehuan {
    margin-left: 32rpx;
    padding: 0 8rpx;
    font-size: 48rpx;
    transform: rotate(90deg);
  }

  .field {
    .input {
      padding: 2rpx 16rpx;
      width: 220rpx;
      color: $uni-text-color;
      font-size: $uni-font-size-base;
      text-align: center;
      border: 1rpx solid $uni-border-color;
    }
    .label {
      margin-top: 8rpx;
      color: $uni-text-color-grey;
      text-transform: uppercase;
      text-align: center;
    }
  }

  .form-body.col-3 {
    justify-content: space-between;
    .field .input {
      width: 120rpx;
    }
  }
}
</style>
