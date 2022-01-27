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
    // if (list.length > MAX_HISTORY_COUNT) {
    //   list = list.slice(-MAX_HISTORY_COUNT);
    // }
    state.historyStepList = list;
    console.log('历史记录', list);
  },
  [TypeKeys.SET_CURRENT_STEP_INDEX] (state, index) {
    state.currentStepIndex = index;
    console.log('当前步骤', state.currentStepIndex);
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
