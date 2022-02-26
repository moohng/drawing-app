import { Ref } from 'vue';
import { useStore } from 'vuex';
import { Path, TypeKeys } from '@/store/types';
import { Paint } from '@/commons/Paint';
import { getRelativeDot, getDot } from '@/commons/utils';
import { throttle } from 'lodash';

export function useCanvasEvent(paint: Ref<Paint | undefined>) {
  let painting = false;
  let currentLine: Path;

  const { windowWidth, windowHeight } = uni.getSystemInfoSync();

  const { state, getters, commit } = useStore();

  const handleTouchStart = (event: TouchEvent) => {
    painting = true;
    const dot = getRelativeDot(getDot(event), { width: windowWidth, height: windowHeight });
    paint.value?.start(dot, {
      color: getters.color,
      width: state.width,
      alpha: getters.alpha,
      type: state.paintType,
    });
    paint.value?.drawLine(dot);

    currentLine = {
      width: state.width,
      color: getters.color,
      pos: [dot],
      type: state.paintType,
    };
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!painting) return;
    const dot = getRelativeDot(getDot(event), { width: windowWidth, height: windowHeight });
    const lastPoint = currentLine.pos[currentLine.pos.length - 1];
    if ((dot.x - lastPoint.x) ** 2 + (dot.y - lastPoint.y) ** 2 < 5 ** 2) return;
    if (currentLine.pos.length < 2) {
      paint.value?.drawLine(dot);
    } else {
      paint.value?.drawLine(dot, currentLine.pos[currentLine.pos.length - 1]);
    }

    currentLine.pos.push(dot);
  };

  const handleTouchEnd = () => {
    if (!painting) return;
    painting = false;

    paint.value?.drawLine(currentLine.pos[currentLine.pos.length - 1]);

    commit(TypeKeys.OPERATION_ADD, {
      currentLine,
      currentImageData: paint.value?.getImageData(),
    });
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
