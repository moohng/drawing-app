import { onReady } from '@dcloudio/uni-app';
import { getCurrentInstance, ref } from 'vue';
import { Paint } from '@/commons/Paint';

const { windowWidth, windowHeight } = uni.getSystemInfoSync();

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
          canvas.width = windowWidth;
          canvas.height = windowHeight;

          const ctx = canvas.getContext('2d') as UniApp.CanvasContext;
          ctx.translate(windowWidth / 2, windowHeight / 2);

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
