import { Ref } from 'vue';
import { useStore } from '@/store';
import { Path, TypeKeys } from '@/store/types';
import { Paint } from '@/commons/Paint';
import { getRelativePoint, getPoint } from '@/commons/utils';

export function useCanvasEvent(paint: Ref<Paint | undefined>) {
  let painting = false;
  let currentLine: Path;

  const { windowWidth, windowHeight } = uni.getSystemInfoSync();

  const store = useStore();

  const handleTouchStart = (event: TouchEvent) => {
    painting = true;
    const point = getRelativePoint(getPoint(event), { width: windowWidth, height: windowHeight });
    paint.value?.start(point, {
      color: store.color,
      width: store.width,
      alpha: store.alpha,
      type: store.paintType,
    });
    paint.value?.drawLine(point);

    currentLine = {
      width: store.width,
      color: store.color,
      points: [point],
      type: store.paintType,
    };
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!painting) return;
    const point = getRelativePoint(getPoint(event), { width: windowWidth, height: windowHeight });
    const lastPoint = currentLine.points[currentLine.points.length - 1];
    if ((point.x - lastPoint.x) ** 2 + (point.y - lastPoint.y) ** 2 < 5 ** 2) return;
    if (currentLine.points.length < 2) {
      paint.value?.drawLine(point);
    } else {
      paint.value?.drawLine(point, lastPoint);
    }

    currentLine.points.push(point);
  };

  const handleTouchEnd = async () => {
    if (!painting) return;
    painting = false;

    paint.value?.drawLine(currentLine.points[currentLine.points.length - 1]);

    const imageData = await paint.value?.getImageData();
    store.operationAdd({
      currentLine,
      currentImageData: imageData,
    });
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
