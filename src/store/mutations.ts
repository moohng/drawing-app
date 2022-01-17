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
  [TypeKeys.SET_CODE] (state, code) {
    state.code = code;
  },
};

export default mutations;
