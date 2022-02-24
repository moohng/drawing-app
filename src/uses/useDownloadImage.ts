import { Paint } from '@/commons/Paint';
import { download, showLoading } from '@/commons/utils';
import { Ref } from 'vue';
import { useStore } from 'vuex';
import { useRewardedVideoAd } from './useAd';
import { useGenerateImage } from './useGenerateImage';

export function useDrawImage(paint: Ref<Paint | undefined>, getters: any) {
  paint.value?.clear();
  paint.value?.setImageData(getters.currentStep);
  paint.value?.setBackground(getters.backgroundColor, true);
}

export function useDownloadImage(paint: Ref<Paint | undefined>, canvasSelect: string) {

  const { state, getters } = useStore();

  // #ifdef MP
  const { showRewardedVideoAd } = useRewardedVideoAd();
  // #endif

  const handleDownload = async () => {
    if (state.currentPathIndex < 0) {
      return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
    }

    // #ifdef MP
    try {
      const isEnded = await showRewardedVideoAd?.();
      if (!isEnded) {
        return uni.showToast({ title: '请完整观看视频！', icon: 'none' });
      }
    } catch (err) {}

    const res = await uni.getSetting({});
    // @ts-ignore
    if (res?.authSetting?.['scope.writePhotosAlbum'] === undefined) {
      try {
        await uni.authorize({ scope: 'scope.writePhotosAlbum' });
      } catch {
        return uni.showToast({ title: '请允许获取系统相册权限', icon: 'none' });
      }
      // @ts-ignore
    } else if (!res?.authSetting?.['scope.writePhotosAlbum']) {
      try {
        // @ts-ignore
        const { authSetting } = await uni.openSetting({});
        if (!authSetting['scope.writePhotosAlbum']) {
          throw new Error();
        }
      } catch (err) {
        return uni.showToast({ title: '请允许获取系统相册权限', icon: 'none' });
      }
    }
    // #endif

    showLoading('正在生成图片...');
    // 绘制图像
    useDrawImage(paint, getters);

    // 生成图片
    const shareImg = await useGenerateImage(canvasSelect);

    // #ifndef H5
    uni.saveImageToPhotosAlbum({
      filePath: shareImg,
      success: () => {
        uni.showToast({ title: '保存成功！', icon: 'none' });
      },
      fail: () => {
        uni.showToast({ title: '保存失败！', icon: 'none' });
      },
    });
    // #endif
    // #ifdef H5
    download(shareImg);
    uni.hideLoading();
    // #endif
  };

  return { handleDownload };
}
