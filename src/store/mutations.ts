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
  [TypeKeys.SET_RANDOM_COLOR] (state, colorList: string[] = getRandomColorList()) {
    state.colorList = colorList.map(item => ({ value: item }));
    state.color = colorList[0];
  },
  [TypeKeys.SET_RANDOM_BACKGROUND_COLOR] (state, bgColorList: string[] = getRandomColorList()) {
    state.bgColorList = bgColorList.map((item, index) => ({ value: index === 4 ? '#ffffff' : item }));
    state.backgroundColor = bgColorList[0];
  },
};

export default mutations;
