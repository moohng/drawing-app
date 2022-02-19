<template>
  <view class="bottom-ad" v-if="showAd">
    <ad class="ad" :unit-id="unitId" :ad-intervals="30" @error="onClose" @close="closeAd = true"></ad>
    <view class="tip" v-if="closeAd" @click="onClose">感谢您的支持！点击关闭广告位</view>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  unitId: {
    type: String,
    default: 'adunit-b9f439209aac273a',
  },
});

const emit = defineEmits<{
  (event: 'hide'): void;
}>()

const showAd = ref(true);
const closeAd = ref(false);

const onClose = () => {
  showAd.value = false;
  emit('hide');
};
</script>

<style lang="scss" scoped>
.bottom-ad {
  position: relative;
  background-color: rgba($color: $bgColor, $alpha: 0.9);
  .ad {
    margin-top: 16rpx;
  }
  .tip {
    position: absolute;
    left: 50%;
    top: 50%;
    color: $uni-text-color-grey;
    font-size: $uni-font-size-sm;
    text-align: center;
    transform: translate(-50%, -50%);
  }
}
</style>
