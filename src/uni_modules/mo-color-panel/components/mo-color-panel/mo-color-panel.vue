<template>
  <view class="color-panel">
    <!-- 对比度、亮度先择区域 -->
    <view class="color-sl" id="colorSL" :style="{ background: hColor }" @touchstart="onSLTouchMove" @touchmove.prevent="onSLTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
      <view class="h-bg">
        <view class="h-inner"></view>
      </view>
      <view class="mark sl-mark" :style="{ left: pointX + '%', top: pointY + '%' }"></view>
    </view>
    <!-- 色相、透明度选择 -->
    <view class="color-ha">
      <view class="trans-bg" style="margin-right: 16rpx;">
        <view class="color-preview" :style="{ backgroundColor: alpha ? rgbaValue : rgbValue }"></view>
      </view>
      <view class="color-ha-bd">
        <view class="h-bar hue" id="colorH" :style="{ height: alpha ? '' : '100%' }" @touchstart="onHTouchMove" @touchmove="onHTouchMove" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
          <view class="mark h-mark" :style="{ left: hOffset + '%' }"></view>
        </view>
        <view class="trans-bg" style="margin-top: 16rpx;" v-if="alpha">
          <view class="h-bar" id="colorA" :style="{ background: `linear-gradient(to right, ${rgbValue.replace('rgb(', 'rgba(').replace(')', `,0)`)}, ${rgbValue})` }" @touchstart="onATouchMove" @touchmove="onATouchMove" @touchend="onTouchEnd" @touchcancel="onTouchEnd">
            <view class="mark h-mark" :style="{ left: aOffset + '%' }"></view>
          </view>
        </view>
      </view>
    </view>
    <!-- 颜色格式转换 -->
    <view class="color-form">
      <view class="form-body" :class="[alpha ? 'col-4' : 'col-3']" v-if="mode === 1">
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
        <view class="field" v-if="alpha">
          <input class="input" :value="form.a" type="number" @blur="onInputChange('a', $event)" @confirm="onInputChange('a', $event)">
          <view class="label">A</view>
        </view>
      </view>
      <view class="form-body" :class="[alpha ? 'col-4' : 'col-3']" v-else-if="mode === 2">
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
        <view class="field" v-if="alpha">
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

<script lang="ts">
import { hsv, rgb } from 'color-convert';
import { HSL } from 'color-convert/conversions';
import { toHSVA } from './tools';

enum MODE {
  RGB = 1,
  HSL = 2,
  HEX = 3,
}

export default {
  name: 'mo-color-panel',
  timer: 0,
  model: {
    event: 'change',
  },
  props: {
    value: {
      type: String,
      default: '#000',
    },
    alpha: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      pointX: 0,
      pointY: 0,
      slRectInfo: {},
      hOffset: 0,
      hRectInfo: {},
      aOffset: 0,
      aRectInfo: {},

      form: {
        r: 0,
        g: 0,
        b: 0,
        h: 0,
        s: 0,
        l: 0,
        a: 1,
        hex: '#000',
      },
      mode: MODE.RGB,
    }
  },
  computed: {
    sValue() { // 对比度 0
      return this.pointX;
    },
    lValue() { // 亮度 100
      return 100 - this.pointY;
    },
    hValue() { // 色相 0
      return 3.6 * this.hOffset;
    },
    hColor() { // 色颜色
      return `hsl(${Math.round(this.hValue)},100%,50%)`;
    },
    aValue() { // 透明度 1
      return parseFloat((((this.aOffset % 100) || 100) / 100).toFixed(2));
    },
    rgbValue() {
      const [r, g, b] = hsv.rgb([this.hValue, this.sValue, this.lValue])
      return `rgb(${r},${g},${b})`;
    },
    rgbaValue() {
      return this.rgbValue.replace('rgb(', 'rgba(').replace(')', `,${this.aValue})`);
    },
  },
  watch: {
    value: {
      handler(val) {
        this.setDefaultValue(val);
      },
      immediate: true,
    },
    rgbaValue: {
      handler() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.setForm();
        }, 20);
      },
      immediate: true,
    },
  },
  mounted() {
    const query = uni.createSelectorQuery().in(this)
    // 亮度和对比度拖拽区域
    query.select('#colorSL').boundingClientRect();
    // 色相
    query.select('#colorH').boundingClientRect();
    // 透明度
    query.select('#colorA').boundingClientRect();
    query.exec(([slInfo, hInfo, aInfo]: UniApp.NodeInfo[]) => {
      this.slRectInfo = slInfo;
      this.hRectInfo = hInfo;
      this.aRectInfo = aInfo;
    });
  },
  methods: {
    setDefaultValue(val: string) {
      const { hsv: defaultHSV, alpha: defaultAlpha } = toHSVA(val);

      console.log(val, '===> hsv', defaultHSV, defaultAlpha);

      this.hOffset = defaultHSV[0] / 3.6;
      this.aOffset = this.alpha ? defaultAlpha * 100 : 100;
      this.pointX = defaultHSV[1];
      this.pointY = 100 - defaultHSV[2];
    },
    // 对比度和亮度选择
    onSLTouchMove(e: any) {
      const { pageX, pageY } = e.touches[0];
      this.setPoint(pageX, pageY);
    },
    setPoint(x: number, y: number) {
      const { left, top, width, height } = this.slRectInfo as UniApp.NodeInfo;
      x = (x - left!) * 100 / width!;
      y = (y - top!) * 100 / height!;
      if (x < 0) {
        x = 0;
      } else if (x > 100) {
        x = 100
      }
      if (y < 0) {
        y = 0;
      } else if (y > 100) {
        y = 100
      }
      this.pointX = x;
      this.pointY = y;
    },
    // 色相透明度选择
    onHTouchMove(e: any) {
      const { pageX } = e.touches[0];
      this.setOffset(pageX, 'hOffset', this.hRectInfo);
    },
    onATouchMove(e: any) {
      const { pageX } = e.touches[0];
      this.setOffset(pageX, 'aOffset', this.aRectInfo);
    },
    setOffset(x: number, key: string, info?: UniApp.NodeInfo) {
      if (!info) {
        return;
      }
      const { left, width } = info;
      x = (x - left!) * 100 / width!;
      if (x < 0) {
        x = 0;
      } else if (x > 100) {
        x = 100
      }
      this[key] = x;
    },
    onTouchEnd() {
      this.onValueChanged();
    },
    onValueChanged() {
      this.$emit('change', this.alpha ? this.rgbaValue : this.rgbValue);
    },
    // 模式切换
    onSwitch() {
      this.mode = this.mode % 3 + 1;
      console.log('模式切换', this.mode);
      this.setForm();
    },
    setForm() {
      const rgbValue = this.rgbValue.match(/\d+/g) as unknown as HSL;
      if (this.mode === MODE.RGB) {
        const [r, g, b] = rgbValue;
        this.form.r = r;
        this.form.g = g;
        this.form.b = b;
        this.form.a = this.aValue || 1;
      } else if (this.mode === MODE.HSL) {
        const [h, s, l] = rgb.hsl(rgbValue);
        this.form.h = h;
        this.form.s = s;
        this.form.l = l;
        this.form.a = this.aValue || 1;
      } else {
        this.form.hex = '#' + rgb.hex(rgbValue) + (this.alpha ? Math.round((this.aValue * 0xff)).toString(16) : '');
      }
    },
    onInputChange(key: string, e: any) {
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
      this.form[key] = value as never;

      if (this.mode === MODE.RGB) {
        const { r, g, b, a } = this.form;
        this.setDefaultValue(`rgba(${r},${g},${b},${a})`);
      } else if (this.mode === MODE.HSL) {
        const { h, s, l, a } = this.form;
        this.setDefaultValue(`hsla(${h},${s},${l},${a})`);
      } else {
        this.setDefaultValue(this.form.hex);
      }

      this.onValueChanged();
    },
  },
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
      padding: 2rpx 8rpx;
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
  .form-body.col-4 {
    justify-content: space-between;
    .field .input {
      width: 90rpx;
    }
  }
}
</style>
