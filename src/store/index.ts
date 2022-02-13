import { getRandomColorList } from '@/commons/utils';
import { createStore } from 'vuex';
import { user } from './modules/user';
import mutations from './mutations';
import { State } from './types';

const colorList = getRandomColorList(5).map(item => ({ value: item }));
colorList[4] = { value: 'rgba(51, 51, 51, 1)' };
const bgColorList = getRandomColorList(5).map(item => ({ value: item }));
bgColorList[0] = { value: 'rgba(255, 255, 255, 1)' };

export const initState: State = {
  /** 绘制数据 */
  path: [],
  color: colorList[0].value,
  backgroundColor: bgColorList[0].value,
  width: 4,
  /** 历史记录数据 */
  currentPathIndex: -1, // 记录path操作记录指针
  historyStepList: [],
  currentStepIndex: -1, // 记录历史步骤指针
  lastStep: undefined, // 历史记录操作最大值的时候，最后一次撤销时 备份需要用/

  env: '',

  colorList,
  bgColorList,
}

const store = createStore({
  state: initState,
  getters: {
    currentStep: state => state.historyStepList[state.currentStepIndex],
    currentPathList: state => state.path.slice(0, state.currentPathIndex + 1),
  },
  modules: {
    user,
  },
  mutations,
});

export default store;
