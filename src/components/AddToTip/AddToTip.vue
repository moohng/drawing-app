<template>
  <view class="add-to-mine" v-if="showAddTip" @click="hideAddTip">将“涂图了”添加到我的小程序，方便下次使用</view>
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
  padding: 8rpx 16rpx;
  top: 16rpx;
  right: 16rpx;
  width: 360rpx;
  color: #666;
  font-size: 26rpx;
  background-color: rgba(0, 0, 0, 0.06);
  border-radius: 16rpx;

  &::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 60%;
    border: 12rpx solid transparent;
    border-bottom-color: rgba(0, 0, 0, 0.06);
  }
}
</style>
