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
      @click="handleMenu"
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
    <!-- 小提示 -->
    <view class="tip" v-if="showTip">点我发现更多功能~</view>
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

/** 小提示 */
const showTip = ref(false);
let tipTimer: number;

const handleMenu = () => {
  emit('clickMenu');
  if (tipTimer) {
    clearTimeout(tipTimer);
    tipTimer = 0;
  }
  if (showTip.value) {
    showTip.value = false;
  }
  uni.setStorageSync('MENU_TIP_KEY', Date.now());
};

tipTimer = setTimeout(() => {
  const tipKey = uni.getStorageSync('MENU_TIP_KEY');
  if (!tipKey) {
    showTip.value = true;
  }
}, 1000 * 10);

/** 显示/隐藏 */
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
  .tip {
    padding: 4rpx 16rpx;
    position: absolute;
    right: 100%;
    top: 50rpx;
    transform: translate(-10%, -50%);
    color: #f1f1f1;
    font-size: 28rpx;
    white-space: nowrap;
    background-color: rgba(0,0,0,0.9);
    border-radius: 8rpx;
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      border: 12rpx solid transparent;
      border-left-color: rgba(0,0,0,0.9);
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
