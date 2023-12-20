import { useStore } from '@/store';
import { useRewardedVideoAd } from './useAd';

export function useDownloadOperation() {

  const store = useStore();

  const { showRewardedVideoAd } = useRewardedVideoAd();

  const beforeSave = async (needAd = false) => {
    if (store.currentPathIndex < 0) {
      throw new Error('先随便画点什么吧~');
    }

    if (needAd) {
      const isEnded = await showRewardedVideoAd?.();
      if (!isEnded) {
        throw new Error('请完整观看视频！');
      }
    }

    const res = await uni.getSetting({});
    // @ts-ignore
    if (res?.authSetting?.['scope.writePhotosAlbum'] === undefined) {
      try {
        await uni.authorize({ scope: 'scope.writePhotosAlbum' });
      } catch {
        throw new Error('请允许获取系统相册权限');
      }
      // @ts-ignore
    } else if (!res?.authSetting?.['scope.writePhotosAlbum']) {
      try {
        // @ts-ignore
        const { authSetting } = await uni.openSetting({});
        if (!authSetting['scope.writePhotosAlbum']) {
          throw new Error('请允许获取系统相册权限');
        }
      } catch (err) {
        throw new Error('请允许获取系统相册权限');
      }
    }
  };

  return { beforeSave };
}
