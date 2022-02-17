import { onMounted, ref } from 'vue';

export function useInterstitialAd() {
  // 在页面中定义插屏广告
  let interstitialAd = ref<UniApp.InterstitialAdContext>();

  onMounted(() => {
    // 在页面onLoad回调事件中创建插屏广告实例
    if (uni.createInterstitialAd) {
      interstitialAd.value = uni.createInterstitialAd({
        adUnitId: 'adunit-c0ef209d582bf665'
      })
      interstitialAd.value.onLoad(() => {})
      interstitialAd.value.onError((err) => {})
      interstitialAd.value.onClose(() => {})
    }
  });

  return { interstitialAd };
}
