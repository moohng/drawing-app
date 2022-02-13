import { Path, Dot } from '@/store/types';
import * as dan from '@moohng/dan';

export function showLoading(title = '加载中...') {
  return uni.showLoading({ title, mask: true });
}

/**
 * 下载资源
 * @param url 下载链接
 * @param name 下载命名
 */
export function download(url: string, name = String(Date.now())) {
  const a = document.createElement('a');
  a.download = name;
  a.href = url;
  a.click();
}

/**
 * 路径兼容，canvas 原点移到中心点
 * @param path 路径
 * @returns
 */
export function pathFallback(path: Path[]): Path[] {
  return path.map((item) => {
    return {
      ...item,
      pos: item.pos.map(({ x, y }) => ({ x: x - 180, y: y - 284 })),
    };
  });
}

/**
 * 坐标点相对中心点
 * @param param0
 * @param param1
 * @returns
 */
export function getRelativeDot({ x, y }: Dot, { width, height }: { width: number; height: number }): Dot {
  return {
    x: x - width * 0.5,
    y: y - height * 0.5,
  };
}

export function getDot(event: TouchEvent) {
  // @ts-ignore
  const { clientX, clientY, x = clientX, y = clientY } = event.touches[0];
  return { x, y };
}

export function getEnv(): string {
  const ua = window.navigator.userAgent.toLowerCase();
  let env = 'h5';
  if (/miniProgram/i.test(ua)) {
    env = 'miniProgram';
  } else if (/MicroMessenger/i.test(ua)) {
    env = 'weixin';
  }
  return env;
}

/**
 * 随机生成颜色值
 * @returns
 */
export function getRandomColor() {
  const r = dan.random('0' as unknown as number, 256, true) as number;
  const g = dan.random('0' as unknown as number, 256, true) as number;
  const b = dan.random('0' as unknown as number, 256, true) as number;
  return `rgba(${r},${g},${b},1)`;
}

/**
 * 生成随机颜色列表
 * @param length 列表长度
 * @returns
 */
export function getRandomColorList(length = 5) {
  const list = [];
  for (let i = 0; i < length; i++) {
    list.push(getRandomColor())
  }
  return list;
}

export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) * 0.5;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}
