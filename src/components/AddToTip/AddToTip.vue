<template>
  <view class="add-to-mine" v-if="showAddTip" @click="hideAddTip">将“涂图了”添加到我的小程序，方便下次继续使用</view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const isFirst = !uni.getStorageSync('__NEW__KEY__');
const showAddTip = ref(isFirst);
const hideAddTip = () => {
  showAddTip.value = false;
  uni.setStorageSync('__NEW__KEY__', Date.now());
};
</script>

<style lang="scss" scoped>
.add-to-mine {
  position: fixed;
  padding: 8rpx 20rpx;
  top: 16rpx;
  right: 16rpx;
  width: 360rpx;
  font-size: 28rpx;
  background-color: rgba($color: $bgColor, $alpha: 0.9);
  border-radius: 16rpx;

  &::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 60%;
    border: 12rpx solid transparent;
    border-bottom-color: rgba($color: $bgColor, $alpha: 0.9);
  }
}
</style>
