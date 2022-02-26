<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
  // #ifdef MP-WEIXIN
  wx.cloud.init({ env: 'drawing-mp-8gojqt3581a22d46', throwOnNotFound: false });
  // #endif
});
onShow(() => {});
onHide(() => {});
</script>
<style lang="scss">
@import './styles/iconfont.css';

page {
  --primaryColor: #00CCFF;
  --bg-color: $bgColor;
  color: #333;
  font-size: 32rpx;
  line-height: 1.6;
}

.canvas {
  width: 100vw;
  height: 100vh;
}

.mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 9998;
}

.mask.cover {
  background-color: rgba(0,0,0,.56);
}

.placeholder {
  color: $uni-border-color;
}

.bg-blur {
  position: relative;
  &::before {
    content: '';
    position: absolute;
    display: block;
    left: 2rpx;
    top: 6rpx;
    width: 100%;
    height: 100%;
    background: inherit;
    border-radius: inherit;
    opacity: 0.6;
    z-index: -1;
    transform: scaleX(0.98);
    filter: blur(12rpx);
  }
}

.bottom-line {
  position: relative;
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-bottom: 1rpx solid $uni-border-color;
    transform: scaleY(0.5);
  }
}
</style>
