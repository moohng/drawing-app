<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
@import './styles/iconfont.css';

page {
  --primaryColor: #00CCFF;
  --bg-color: $bgColor;
  color: #333;
  font-size: 32rpx;
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
  background-color: rgba(0,0,0,.6);
}

.placeholder {
  color: $uni-border-color;
}
</style>
