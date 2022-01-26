import { onReady } from '@dcloudio/uni-app';
import { getCurrentInstance, ref } from 'vue';
import { Paint } from '@/commons/Paint';

export default function usePaint(selector: string) {
  const paint = ref<Paint>();

  const initCanvas = (canvas: any) => {
    const { windowWidth, windowHeight, pixelRatio } = uni.getSystemInfoSync();
    /**
     * 解决绘图路径锯齿问题
     * 1. 尺寸取物理像素 windowWidth * pixelRatio
     * 2. 画布缩放像素比 ctx.scale
     */
    canvas.width = windowWidth * pixelRatio;
    canvas.height = windowHeight * pixelRatio;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.translate(windowWidth * pixelRatio / 2, windowHeight * pixelRatio / 2);

    // #ifndef MP-TOUTIAO
    ctx.scale(pixelRatio, pixelRatio);
    // #endif

    paint.value = new Paint(ctx);
  };

  onReady(() => {
    // #ifdef MP
    uni
      .createSelectorQuery()
      .select('#' + selector)
      // #ifdef MP-TOUTIAO
      // @ts-ignore
      .node()
      .exec(([{ node: canvas }]) => {
        initCanvas(canvas);
      })
      // #endif
      // #ifndef MP-TOUTIAO
      .fields(
        {
          // @ts-ignore
          node: true,
          size: true,
        },
        ({ node: canvas }: any) => {
          initCanvas(canvas);
        }
      ).exec();
      // #endif
    // #endif
    // #ifndef MP
    const { windowWidth, windowHeight } = uni.getSystemInfoSync();
    const ctx = uni.createCanvasContext(selector, getCurrentInstance());
    ctx.translate(windowWidth / 2, windowHeight / 2);
    paint.value = new Paint(ctx as unknown as CanvasRenderingContext2D);
    // #endif
  });

  return paint;
}
