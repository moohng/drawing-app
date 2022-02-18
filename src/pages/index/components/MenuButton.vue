<template>
  <view class="menu-button" :style="{ color: getters.color, top: toTop + 'px' }">
    <button class="button" @click="$emit('click')"><text class="iconfont icon-caidan"></text></button>
  </view>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const { state, getters } = useStore();
const toTop = computed(() => {
  return state.headerHeight + 32 * state.windowWidth / 750;
});
</script>

<style lang="scss" scoped>
.menu-button {
  position: fixed;
  top: 84rpx;
  right: 32rpx;

  .button {
    margin: 0;
    width: 96rpx;
    height: 96rpx;
    border-radius: 200rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: currentColor;
    font-weight: normal;
    background-color: rgba($color: $bgColor, $alpha: 0.9);
    box-shadow: $shadow;

    &::after {
      border: none;
    }

    // #ifndef MP
    &:active,
    // #endif
    &.button-hover {
      background-color: rgba($bgColorHover, 0.6);
    }

    .iconfont {
      font-size: 56rpx;
    }
  }
}
</style>
