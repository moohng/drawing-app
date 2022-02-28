interface CustomShareAppMessage {
  title: string;
  content: string;
  imageUrl?: string;
  path?: string;
}

export const shareConfig: CustomShareAppMessage = {
  title: '发现一个好玩的画图小程序，快来看看我最新的大作吧~',
  content: '找到一款神奇的绘图工具，快来体验一下吧！',
};

export const baseUrl = 'https://ff827abe-e27d-48d4-a09a-81355a2ce85d.bspapp.com';

// 最大历史记录长度
export const MAX_HISTORY_COUNT = 10;

export const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0';
