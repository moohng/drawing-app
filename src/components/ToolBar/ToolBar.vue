<template>
  <!-- 操作区域 -->
  <view class="toolbar">
    <view class="button" @click="handleRevoke"><text class="iconfont icon-revoke"></text></view>
    <view class="button" @click="handleClear"><text class="iconfont icon-clear"></text></view>
    <view class="button" @click="handlePreview"><text class="iconfont icon-preview"></text></view>
    <view class="button" @click="handleDownload"><text class="iconfont icon-download"></text></view>
    <view class="button" @click="handleShare"><text class="iconfont icon-share"></text></view>
  </view>

  <!-- 颜色选择 -->
  <radio-group class="color-bar" @change="handleColorSelect">
    <view class="button" v-for="(color, index) in colorList" :key="index">
      <radio :value="color" :checked="state.color === color" />
      <text class="icon" :style="{ color }"></text>
    </view>
  </radio-group>

  <!-- 画笔宽度 -->
  <radio-group class="width-bar" @change="handleWidthSelect">
    <view class="button" v-for="(item, index) in widthList" :key="index">
      <radio :value="String(value)" :checked="value === state.width" />
      <text class="icon" :style="{ width: `${width}px`, height: `${width}px`, color: state.color }"></text>
    </view>
  </radio-group>

  <!-- 分享图片预览 -->
  <view v-if="shareImg" class="preview-cover" @click="() => setShareImg('')">
    <image class="share-img" :src="shareImg" mode="widthFix" lazyLoad />
    <view class="bottom">
      <view class="btn" @click="handleSave">保存</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useStore } from 'vuex';
import * as dan from '@moohng/dan';
import { Paint } from '@/commons/Paint';
import { TypeKeys } from '@/store/types';

const { paint } = defineProps<{
  paint: Paint;
}>();

const emit = defineEmits<{
  (event: 'save', code: string): void;
  (event: 'preview'): void;
}>();

const colorList = ['#ffffff', '#000000', '#FF3333', '#0066FF', '#FFFF33', '#33CC66'];

const widthList = [
  { value: 2, width: 4 },
  { value: 4, width: 6 },
  { value: 6, width: 8 },
  { value: 12, width: 10 },
  { value: 20, width: 12 },
  { value: 30, width: 14 },
];

const { state, commit } = useStore();

const handleColorSelect = (e: any) => {
  commit(TypeKeys.SET_COLOR, e.detail.value);
};

const handleWidthSelect = (e: any) => {
  commit(TypeKeys.SET_WIDTH, e.detail.value);
};

/** 操作 */

const handleRevoke = () => {
  const path = state.path.slice(0, state.path.length - 1);
  commit(TypeKeys.SET_PATH, path);

  paint.clear();
  paint.drawPath(path);
};

const handleClear = () => {
  commit(TypeKeys.SET_PATH, []);

  paint.clear();
};

const handlePreview = () => {
  if (!state.path.length) {
    return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
  }
  emit('preview');
};

const shareImg = ref('');

const handleDownload = () => {
  if (!state.path.length) {
    return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
  }
  // 生成图片
  uni
    .createSelectorQuery()
    .select('#drawCanvas')
    .fields(
      {
        // @ts-ignore
        node: true,
        size: true,
      },
      ({ node: canvas }: any) => {
        uni.canvasToTempFilePath({
          // @ts-ignore
          canvas,
          success: ({ tempFilePath }) => {
            shareImg.value = tempFilePath;
          },
        });
      }
    )
    .exec();
};

const handleSave = () => {
  uni.saveImageToPhotosAlbum({
    filePath: shareImg.value,
    success: () => {
      uni.showToast({ title: '已保存！', icon: 'none' });
    },
  });
};

const handleShare = () => {
  if (!state.path.length) {
    return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
  }
  // 生成随机口令
  const code = dan.random(8) as string;
  emit('save', code);
};
</script>

<style lang="scss" scoped>
.toolbar {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  padding-bottom: env(safe-area-inset-bottom);
  padding-bottom: constant(safe-area-inset-bottom);
}

.toolbar .button {
  width: 44px;
  height: 44px;
  color: var(--primaryColor);
  border: 1px solid;
  border-radius: 100px;
  display: flex;
  justify-content: center;
  align-items: center;

  + .button {
    margin-left: 8px;
  }
}

.toolbar .button .iconfont {
  font-size: 24px;
}

.color-bar,
.width-bar {
  padding: 8px 0;
  position: fixed;
  top: 45%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  background-color: rgba($color: #efefef, $alpha: 0.6);
  border-radius: 100px;
}

.color-bar {
  right: 12px;
}

.width-bar {
  left: 12px;
}

.color-bar .button,
.width-bar .button {
  position: relative;
  margin: 8px 0;
  width: 44px;
  text-align: center;
}

.button radio {
  display: block;
  margin: 0;
  width: 100%;
  height: 22px;
  opacity: 0;
}

.button radio + .icon {
  padding: 4px;
  position: absolute;
  top: 0;
  left: 50%;
  width: 14px;
  height: 14px;
  transform: translateX(-50%);
  background-color: currentColor;
  background-clip: content-box;
  z-index: -1;
  pointer-events: none;
}

.button radio + .icon {
  border-radius: 16px;
}

.button radio[aria-checked='true'] + .icon,
.color-bar .button radio[aria-checked='true'] + .icon {
  box-shadow: 0 0 8px var(--primaryColor);
}

.color-bar .button radio + .icon {
  box-shadow: 0 0 1px currentColor;
}

.width-bar .button input[type='radio']::after {
  width: inherit;
  height: inherit;
}

.line {
  margin: 4px 8px;
  border-bottom: 1px solid #ddd;
}
</style>
