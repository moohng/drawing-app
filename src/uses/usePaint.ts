import { onReady } from '@dcloudio/uni-app';
import { getCurrentInstance, ref } from 'vue';
import { Paint } from '@/commons/Paint';

const { windowWidth, windowHeight, pixelRatio } = uni.getSystemInfoSync();

export default function usePaint(selector: string) {
  const paint = ref<Paint>();

  onReady(() => {
    // #ifdef MP-WEIXIN
    uni
      .createSelectorQuery()
      .select('#' + selector)
      .fields(
        {
          // @ts-ignore
          node: true,
          size: true,
        },
        ({ node: canvas }: any) => {
          /**
           * 解决绘图路径锯齿问题
           * 1. 尺寸取物理像素 windowWidth * pixelRatio
           * 2. 画布缩放像素比 ctx.scale
           */
          canvas.width = windowWidth * pixelRatio;
          canvas.height = windowHeight * pixelRatio;

          const ctx = canvas.getContext('2d') as UniApp.CanvasContext;
          ctx.translate(windowWidth * 3 / 2, windowHeight * 3 / 2);
          ctx.scale(pixelRatio, pixelRatio);

          paint.value = new Paint(ctx);
        }
      ).exec();
    // #endif
    // #ifndef MP-WEIXIN
    const ctx = uni.createCanvasContext(selector, getCurrentInstance());
    ctx.translate(windowWidth / 2, windowHeight / 2);
    paint.value = new Paint(ctx);
    // #endif
  });

  return paint;
}
