<template>
  <view class="page">
    <!-- 无数据 -->
    <view class="empty" v-if="list && !list.length">
      <view class="tip">这里啥也没有，赶紧去画一幅吧</view>
      <view class="button" :style="{ backgroundColor: getters.themeColor }" @click="goStart">去创作</view>
    </view>
    <!-- 作品列表 -->
    <view class="list" v-else>
      <view class="item bg-blur" v-for="item in list" :key="item._id" @click="goPlay(item)" @longpress="handleMore(item)">
        <image class="image" :src="item.imgUrl" mode="aspectFill" lazy-load></image>
        <view class="preview-button" :style="{ color: getters.themeColor }" @click.stop="handlePreview(item)">
          <text class="iconfont icon-xianshikejian"></text>
        </view>
        <view class="title" v-if="item.title">
          <text class="text-cut-3">{{ item.title }}</text>
        </view>
      </view>
    </view>
    <view class="no-more" v-if="!hasNext && pageIndex > 1">只有这么多了~</view>
  </view>
</template>

<script lang="ts" setup>
import { deleteImage, deletePathById, fetchList } from '@/commons/api';
import { savePaintToLocal } from '@/commons/utils';
import { ref } from 'vue';
import { useStore } from 'vuex';

const { getters } = useStore();

const list = ref();
const hasNext = ref(true);
let pageIndex = ref(1);
const pageSize = 20;

const getList = () => {
  fetchList({
    isMine: true,
    pageIndex: pageIndex.value,
    pageSize,
  }).then(({ result }) => {
    const { data } = result;
    list.value = pageIndex.value > 1 ? list.value.concat(data) : data;
    if (data?.length && data.length >= pageSize) {
      hasNext.value = true;
      pageIndex.value++;
    } else {
      hasNext.value = false;
    }
  });
};

getList();

const goPlay = (item: any) => {
  savePaintToLocal(item);
  uni.navigateTo({ url: '/pages/play/index?id=' + item._id });
};

const goStart = () => {
  uni.reLaunch({ url: '/pages/index/index' });
};

const handleMore = async (item: any) => {
  uni.showActionSheet({
    itemList: ['删除'],
    alertText: '确定要删除吗？',
    itemColor: 'red',
    success: async ({ tapIndex }) => {
      if (tapIndex === 0) {
        await deletePathById([item._id]);
        list.value = list.value.filter(({ _id }: any) => _id !== item._id);
        // deleteImage([item.imgUrl]);
      }
    },
  });
};

const handlePreview = (item: any) => {
  uni.previewImage({
    urls: [item.imgUrl],
  });
};
</script>

<style lang="scss" scoped>
.page {
  min-height: 100vh;
  background-color: $bgColor;
}
.list {
  padding: 32rpx;
  .item {
    float: left;
    position: relative;
    margin-bottom: 24rpx;
    width: 334rpx;
    background-color: #fff;
    border-radius: 16rpx;
    box-shadow: $shadow;
    overflow: hidden;
    &:nth-child(even) {
      float: right;
    }
    .image {
      display: block;
      width: 100%;
      height: 440rpx;
    }

    .preview-button {
      position: absolute;
      right: 24rpx;
      top: 16rpx;
      width: 80rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      .iconfont {
        font-size: 48rpx;
      }
    }
    .title {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 8rpx 12rpx 16rpx;
      color: #fff;
      font-size: $uni-font-size-base;
      line-height: 1.6;
      background-color: rgba(0, 0, 0, .3);
    }
  }
  &::after {
    content: '';
    display: block;
    clear: both;
  }
}

.empty {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .tip {
    color: $uni-text-color-grey;
    font-size: $uni-font-size-base;
  }
  .button {
    margin-top: 32rpx;
    padding: 14rpx 44rpx;
    color: #fff;
    text-align: center;
    border-radius: 100rpx;
    overflow: hidden;
    margin-bottom: 20%;
  }
}

.no-more {
  padding: 24rpx;
  color: $uni-text-color-grey;
  font-size: $uni-font-size-base;
  text-align: center;
}
</style>
