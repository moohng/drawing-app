<template>
  <view class="bottom-ad" v-if="showAd">
    <ad unit-id="adunit-b9f439209aac273a" :ad-intervals="30" @error="onClose" @close="onClose"></ad>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const emit = defineEmits<{
  (event: 'hide'): void;
}>()

const showAd = ref(true);

const onClose = () => {
  showAd.value = false;
  emit('hide');
};
</script>

<style lang="scss" scoped>
.bottom-ad {
  ad {
    margin-top: 8rpx;
  }
}
</style>
