<template>
  <view class="page">
    <!-- <button>颜色选择</button> -->
    <mo-color-panel v-model:value="currentColor"></mo-color-panel>
    <view>{{ currentColor }}</view>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

let isPressed = false;

export default defineComponent({
  data() {
    return {
      currentColor: '#01b10a60',
    };
  },
  methods: {
    onTouchStart(e: any) {
      uni.showToast({ title: 'touch start', icon: 'none' });
      isPressed = true;
    },
    onTouchMove(e: any) {
      if (!isPressed) return;
    },
    onTouchEnd(e: any) {
      isPressed = false;
    },
  }
});
</script>

<style lang="scss" scoped>
.page {
  padding: 24rpx;
}
</style>
