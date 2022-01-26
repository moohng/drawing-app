import { getRandomColorList } from '@/commons/utils';
import { createStore } from 'vuex';
import { user } from './modules/user';
import mutations from './mutations';
import { State } from './types';

const colorList = getRandomColorList(5).map(item => ({ value: item }));
colorList[4] = { value: '#333333' };
const bgColorList = getRandomColorList(5).map(item => ({ value: item }));
bgColorList[0] = { value: '#ffffff' };

export const initState: State = {
  /** 绘制数据 */
  path: [],
  color: colorList[0].value,
  backgroundColor: bgColorList[0].value,
  width: 4,

  env: '',

  colorList,
  bgColorList,
}

const store = createStore({
  state: initState,
  modules: {
    user,
  },
  mutations,
});

export default store;
