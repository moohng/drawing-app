import { Paint } from '@/commons/Paint';
import { showLoading } from '@/commons/utils';
import { useStore } from '@/store';
import { useRewardedVideoAd } from './useAd';

export function useDownloadImage() {

  const store = useStore();

  const { showRewardedVideoAd } = useRewardedVideoAd();

  const handleDownload = async (paint: Paint) => {
    if (store.currentPathIndex < 0) {
      return uni.showToast({ title: '先随便画点什么吧~', icon: 'none' });
    }

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

    showLoading('正在生成图片...');
    // 绘制图像
    paint.clear();
    paint.setImageData(store.currentStep);
    paint.setBackground(store.backgroundColor, true);

    // 生成图片
    const shareImg = await paint.toDataURL() as string;

    uni.saveImageToPhotosAlbum({
      filePath: shareImg,
      success: () => {
        uni.showToast({ title: '保存成功！', icon: 'none' });
      },
      fail: () => {
        uni.showToast({ title: '保存失败！', icon: 'none' });
      },
    });
  };

  return { handleDownload };
}
