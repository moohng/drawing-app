import { MAX_HISTORY_COUNT } from '@/commons/config';
import { getRandomColorList } from '@/commons/utils';
import { MutationTree } from 'vuex';
import { State, TypeKeys } from './types';


const mutations: MutationTree<State> = {
  [TypeKeys.SET_PATH] (state, path) {
    state.path = path;
  },
  [TypeKeys.SET_COLOR] (state, color) {
    state.color = color;
  },
  [TypeKeys.SET_BACKGROUND_COLOR](state, backgroundColor) {
    state.backgroundColor = backgroundColor;
  },
  [TypeKeys.SET_WIDTH] (state, width) {
    state.width = width;
  },
  [TypeKeys.SET_HISTORY_STEP_LIST] (state, list) {
    if (list.length > MAX_HISTORY_COUNT) {
      state.lastStep = list.slice(-MAX_HISTORY_COUNT - 1, -MAX_HISTORY_COUNT)[0];
      state.historyStepList = list.slice(-MAX_HISTORY_COUNT);
    } else {
      state.historyStepList = list;
    }
    // console.log('步骤记录', state.historyStepList, state.lastStep);
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
  [TypeKeys.OPERATION_ADD] (state) {
    state.currentPathIndex++;
    state.currentStepIndex = state.currentStepIndex < MAX_HISTORY_COUNT - 1 ? state.currentStepIndex + 1 : MAX_HISTORY_COUNT - 1;
    console.log('添加', state.currentPathIndex, state.currentStepIndex);
  },
  [TypeKeys.OPERATION_CLEAR] (state) {
    state.currentPathIndex = -1;
    state.currentStepIndex = -1;
    state.path = [];
    state.historyStepList = [];
  },
  [TypeKeys.SET_RANDOM_COLOR] (state, colorList: string[] = getRandomColorList()) {
    state.colorList = colorList.map((item, index) => ({ value: index === 4 ? '#333333' : item }));
    state.color = colorList[0];
  },
  [TypeKeys.SET_RANDOM_BACKGROUND_COLOR] (state, bgColorList: string[] = getRandomColorList()) {
    state.bgColorList = bgColorList.map((item, index) => ({ value: index === 0 ? '#ffffff' : item }));
    state.backgroundColor = state.bgColorList[0].value;
  },
};

export default mutations;
