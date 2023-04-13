
import { getCurrentInstance, onMounted, ref } from 'vue';
import { Paint } from '@/commons/Paint';

/**
 * todo 画布的宽高需要重新定义，不同屏幕大小的设备不能保持一致
 * @param selector
 * @returns
 */
export default function usePaint(selector?: string | null, onLoad?: () => void) {
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
    ctx.scale(pixelRatio, pixelRatio);

    paint.value = new Paint(ctx, canvas);
  };

  if (selector) {
    onMounted(() => {
      uni
        .createSelectorQuery()
        .in(getCurrentInstance())
        .select('#' + selector)
        .fields(
          {
            // @ts-ignore
            node: true,
            size: true,
          },
          ({ node: cs }: any) => {
            initCanvas(cs);
            onLoad?.();
          }
        ).exec();
    });
  } else {
    const canvas = wx.createOffscreenCanvas({ type: '2d'});
    initCanvas(canvas);
    onLoad?.();
  }

  return { paint };
}
