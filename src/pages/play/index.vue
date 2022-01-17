<template>
  <canvas id="drawCanvas" type="2d" class="canvas" @click="handlePlayToggle" />
  <view class="preview-cover" v-if="!isPlaying">
    <text class="iconfont icon-play" @click="handlePlayToggle"></text>
    <view class="bottom">
      <view class="btn" @click="handleGoPlay">我也要玩~</view>
      <view class="btn" @click="handlePwd">输入口令</view>
    </view>
  </view>
  <Dialog :visible="showDialog" title="请输入口令：" :buttons="['取消', '确定']" @click="handleClick">
    <input type="text" placeholder="口令" :value="code" @input="handleInput" />
  </Dialog>
</template>
