import { bgColorList, colorList } from '@/commons/config';
import { createStore } from 'vuex';
import mutations from './mutations';
import { State } from './types';

export const initState: State = {
  /** 绘制数据 */
  path: [],
  color: colorList[0].value,
  backgroundColor: bgColorList[0].value,
  width: 4,

  env: '',
}

const store = createStore({
  state: initState,
  mutations,
});

export default store;
