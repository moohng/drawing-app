import { MAX_HISTORY_COUNT } from '@/commons/config';
import { getRandomColorList } from '@/commons/utils';
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
  [TypeKeys.SET_RANDOM_COLOR] (state, colorList: string[] = getRandomColorList()) {
    state.colorList = colorList.map((item, index) => ({ value: index === 4 ? 'rgb(51, 51, 51)' : item }));
  },
  [TypeKeys.SET_RANDOM_BACKGROUND_COLOR] (state, bgColorList: string[] = getRandomColorList()) {
    state.bgColorList = bgColorList.map((item, index) => ({ value: index === 0 ? 'rgb(255, 255, 255)' : item }));
  },
  [TypeKeys.EDIT_COLOR_LIST_BY_INDEX] (state, color) {
    state.colorList[state.colorIndex] = color;
  },
};

export default mutations;
