import { defineStore } from 'pinia';

export const useSystemStore = defineStore('system', {
  state() {
    const { statusBarHeight = 20, windowWidth, windowHeight, pixelRatio } = uni.getSystemInfoSync();
    let navHeight = 44;
    // #ifdef MP-WEIXIN
    const { top, bottom } = uni.getMenuButtonBoundingClientRect();
    navHeight = top + bottom - 2 * statusBarHeight;
    // #endif
    // #ifdef H5
    navHeight = 0;
    // #endif

    return {
      statusBarHeight,
      navHeight,
      headerHeight: statusBarHeight + navHeight,
      windowWidth,
      windowHeight,
      pixelRatio,
    }
  },
});
