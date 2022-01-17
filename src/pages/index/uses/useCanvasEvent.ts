import { useStore } from 'vuex';
import { Path, TypeKeys } from "../../../store/types";
import { Paint } from "../../../commons/Paint";
import { getRelativeDot, getDot } from '../../../commons/utils';
import { Ref } from 'vue';

export function useCanvasEvent(paint: Ref<Paint | undefined>) {
  let painting = false;
  let currentLine: Path;

  const { windowWidth, windowHeight } = uni.getSystemInfoSync();

  const { state, commit } = useStore();

  const handleTouchStart = (event: any) => {
    painting = true
    const dot = getRelativeDot(getDot(event), { width: windowWidth, height: windowHeight})
    const { color, width } = state
    paint.value?.start(dot, color, width)
    paint.value?.drawLine(dot)

    currentLine = {
      width,
      color,
      pos: [dot],
    }
  }

  const handleTouchMove = (event: any) => {
    if (!painting) return
    const dot = getRelativeDot(getDot(event), { width: windowWidth, height: windowHeight})
    paint.value?.drawLine(dot)

    currentLine.pos.push(dot)
  }

  const handleTouchEnd = () => {

    if (!painting) return
    painting = false

    commit(TypeKeys.SET_PATH, state.path.concat(currentLine))
  }

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  }
}
