import { onMounted } from 'vue';

/**
 * 获取插屏广告
 * @param unitId
 * @returns
 */
export function useInterstitialAd(unitId = 'adunit-c0ef209d582bf665') {
  // 在页面中定义插屏广告
  let interstitialAd: UniApp.InterstitialAdContext;

  const showInterstitialAd = () => interstitialAd?.show();

  onMounted(() => {
    // 在页面onLoad回调事件中创建插屏广告实例
    if (uni.createInterstitialAd) {
      interstitialAd = uni.createInterstitialAd({ adUnitId: unitId });
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
    }
  });

  return { showInterstitialAd };
}

export function useRewardedVideoAd(unitId = 'adunit-a2b0b5949ea23f97') {
  let rewardedVideoAd: UniApp.RewardedVideoAdContext;
  interface CloseCallback {
    (isEnded: boolean): void;
  }
  let onCLose: CloseCallback;

  const showRewardedVideoAd = (closeCallback: CloseCallback) => {
    onCLose = closeCallback;
    return rewardedVideoAd?.show().catch(() => {
      rewardedVideoAd.load().then(() => rewardedVideoAd.show()).catch(() => {
        console.log('激励视频广告显示失败！');
      });
    });
  };

  onMounted(() => {
    rewardedVideoAd = uni.createRewardedVideoAd({ adUnitId: unitId });
    rewardedVideoAd.onLoad(() => {});
    rewardedVideoAd.onError(() => {});
    rewardedVideoAd.onClose(({ isEnded }) => {
      onCLose?.(isEnded);
    });
  });

  return { showRewardedVideoAd };
}
