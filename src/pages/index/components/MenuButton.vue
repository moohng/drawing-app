<template>
  <view
    class="menu-button"
    :style="{
      color: getters.themeColor,
      top: toTop + 'px',
    }"
    >
    <button
      class="button"
      :class="{ rotate: menuBg }"
      :style="{ backgroundImage: menuBg }"
      @click="$emit('clickMenu')"
    >
      <text v-if="!menuBg" class="iconfont icon-caidan"></text>
    </button>
    <button
      v-if="mode === PageMode.COPY"
      class="button"
      :class="{ ghost: !eyeActive }"
      @click="clickEye"
      @longpress="onLongPressEye"
    >
      <text class="iconfont icon-xianshikejian" v-if="eyeOpen"></text>
      <text class="iconfont icon-yincangbukejian" v-else></text>
    </button>
  </view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useStore } from 'vuex';
import { PageMode } from '../types';

const props = defineProps<{
  mode: PageMode;
}>();

const emit = defineEmits<{
  (event: 'clickMenu'): void;
  (event: 'toggleEye', eyeOpen: boolean): void;
  (event: 'longPressEdit'): void;
}>();

const { state, getters } = useStore();

const menuBg = computed(() => {
  const { userInfo } = state.user;
  return userInfo?.avatarUrl ? `url(${userInfo?.avatarUrl})` : '';
});

const toTop = computed(() => {
  return state.headerHeight + 32 * state.windowWidth / 750;
});

const eyeActive = ref(false);
const eyeOpen = ref(true);
const clickEye = () => {
  setEyeActive();
  eyeOpen.value = !eyeOpen.value;
  emit('toggleEye', eyeOpen.value);
};
const onLongPressEye = () => {
  eyeOpen.value = true;
  emit('toggleEye', eyeOpen.value);
  emit('longPressEdit');
};
let timer: number;
const setEyeActive = () => {
  clearTimeout(timer);
  eyeActive.value = true;
  timer = setTimeout(() => {
    eyeActive.value = false;
  }, 3000);
};
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
    background-size: cover;
    box-shadow: $shadow;
    transition: opacity 0.3s;

    &::after {
      content: none;
      border: none;
    }

    // #ifndef MP
    &:active,
    // #endif
    &.button-hover {
      background-color: rgba($bgColorHover, 0.6);
    }

    &.rotate {
      animation: rotate 10s linear infinite;
    }

    .iconfont {
      font-size: 56rpx;
    }

    + .button {
      margin-top: 32rpx;
    }

    &.ghost {
      background-color: transparent;
      box-shadow: none;
      opacity: 0.6;
    }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
