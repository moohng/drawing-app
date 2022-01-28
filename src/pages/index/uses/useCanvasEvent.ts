import { Ref } from 'vue';
import { useStore } from 'vuex';
import { Path, TypeKeys } from '@/store/types';
import { Paint } from '@/commons/Paint';
import { getRelativeDot, getDot } from '@/commons/utils';
import { MAX_HISTORY_COUNT } from '@/commons/config';

export function useCanvasEvent(paint: Ref<Paint | undefined>) {
  let painting = false;
  let currentLine: Path;

  const { windowWidth, windowHeight } = uni.getSystemInfoSync();

  const { state, commit } = useStore();

  const handleTouchStart = (event: TouchEvent) => {
    painting = true;
    const dot = getRelativeDot(getDot(event), { width: windowWidth, height: windowHeight });
    const { color, width } = state;
    paint.value?.start(dot, color, width);
    paint.value?.drawLine(dot);

    currentLine = {
      width,
      color,
      pos: [dot],
    };
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!painting) return;
    const dot = getRelativeDot(getDot(event), { width: windowWidth, height: windowHeight });
    paint.value?.drawLine(dot);

    currentLine.pos.push(dot);
  };

  const handleTouchEnd = () => {
    if (!painting) return;
    painting = false;

    // 步骤 +1
    commit(TypeKeys.OPERATION_ADD);

    // 保存路径
    const path = state.path.slice(0, state.currentPathIndex);
    commit(TypeKeys.SET_PATH, path.concat(currentLine));

    // 生成记录
    const list = state.historyStepList.slice(0, state.currentStepIndex >= MAX_HISTORY_COUNT - 1 ? state.currentStepIndex + 1 : state.currentStepIndex);
    commit(TypeKeys.SET_HISTORY_STEP_LIST, list.concat(paint.value?.getImageData()));
  };

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
}
