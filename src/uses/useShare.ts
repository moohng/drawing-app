import { onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app';

interface ShareConfig {
  title?: string;
  path?: string;
  query?: string;
  imageUrl?: string;
}

export default function useShare(config: ShareConfig = {}) {
  // 分享
  onShareAppMessage(() => ({
    ...config,
  }));
  // 分享到朋友圈
  onShareTimeline(() => ({
    ...config,
  }));
}
