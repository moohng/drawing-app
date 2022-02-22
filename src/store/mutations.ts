import { MAX_HISTORY_COUNT } from '@/commons/config';
import { MutationTree } from 'vuex';
import { State, TypeKeys } from './types';


const mutations: MutationTree<State> = {
  [TypeKeys.SET_PATH] (state, path) {
    state.path = path;
  },
  [TypeKeys.SET_COLOR_INDEX] (state, colorIndex) {
    state.colorIndex = colorIndex;
  },
  [TypeKeys.SET_BACKGROUND_COLOR_INDEX](state, backgroundColorIndex) {
    state.backgroundColorIndex = backgroundColorIndex;
  },
  [TypeKeys.SET_WIDTH] (state, width) {
    state.width = width;
  },
  [TypeKeys.SET_PAINT_TYPE] (state, paintType) {
    state.paintType = paintType;
  },
  [TypeKeys.OPERATION_UNDO] (state) {
    if (state.currentStepIndex > -1) {
      state.currentStepIndex--;
      state.currentPathIndex--;
    }
    console.log('撤销', state.currentPathIndex, state.currentStepIndex);
  },
  [TypeKeys.OPERATION_REDO] (state) {
    if (state.currentStepIndex < state.historyStepList.length - 1) {
      state.currentStepIndex++;
      state.currentPathIndex++;
    }
    // console.log('恢复', state.currentPathIndex, state.currentStepIndex);
  },
  [TypeKeys.OPERATION_ADD] (state, { currentLine, currentImageData }) {
    // 保存路径
    state.currentPathIndex++;
    state.path = state.path.slice(0, state.currentPathIndex).concat(currentLine);

    // 历史记录
    if (state.currentStepIndex >= MAX_HISTORY_COUNT - 1) {
      // 历史记录已满
      const [last, ...list] = state.historyStepList.concat(currentImageData);
      state.lastStep = last;
      state.historyStepList = list;
    } else {
      state.currentStepIndex++;
      state.historyStepList = state.historyStepList.slice(0, state.currentStepIndex).concat(currentImageData);
    }
    console.log('添加', state.currentPathIndex, state.currentStepIndex, state.historyStepList);
  },
  [TypeKeys.OPERATION_CLEAR] (state) {
    state.currentPathIndex = -1;
    state.currentStepIndex = -1;
    state.path = [];
    state.historyStepList = [];
    state.lastStep = undefined;
  },
  [TypeKeys.EDIT_COLOR_LIST_BY_INDEX] (state, color) {
    state.colorList[state.colorIndex] = color;
    uni.setStorageSync('COLOR_LIST', state.colorList);
  },
  [TypeKeys.EDIT_BACKGROUND_LIST_BY_INDEX] (state, color) {
    state.bgColorList[state.backgroundColorIndex] = color;
    uni.setStorageSync('BACKGROUND_COLOR_LIST', state.bgColorList);
  },
};

export default mutations;
