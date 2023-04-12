<template>
  <view class="add-to-mine" v-if="showAddTip" :style="{ top: toTop + 'px' }" @click="hideAddTip">将“涂图了”添加到我的小程序，下次打开更方便哦</view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useStore } from '@/store';

const store = useStore();

const toTop = computed(() => {
  return store.headerHeight + 16 * store.windowWidth / 750;
});

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
  top: 136rpx;
  right: 16rpx;
  width: 360rpx;
  color: #f1f1f1;
  font-size: 28rpx;
  background-color: #333;
  border-radius: 16rpx;
  z-index: 99999;

  &::after {
    content: '';
    position: absolute;
    bottom: 100%;
    left: 60%;
    border: 12rpx solid transparent;
    border-bottom-color: #333;
  }
}
</style>
