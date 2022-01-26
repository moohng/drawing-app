<template>
  <view class="avatar" @click="emit('click')">
    <!-- #ifdef MP-WEIXIN -->
    <!-- <open-data type="userAvatarUrl"></open-data> -->
    <!-- #endif -->
  </view>
</template>

<script lang="ts" setup>
const emit = defineEmits<{
  (event: 'click'): void;
}>();
</script>

<style lang="scss" scoped>
.avatar {
  position: absolute;
  right: 32rpx;
  top: 32rpx;
  width: 96rpx;
  height: 96rpx;
  border-radius: 96rpx;
  background-color: rgba($bgColor, 0.9);
  box-shadow: 0 4rpx 16rpx 0 rgba($bgColor, 0.4);
  overflow: hidden;
}
</style>
