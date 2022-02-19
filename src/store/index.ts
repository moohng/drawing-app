import { getRandomColorList } from '@/commons/utils';
import { createStore } from 'vuex';
import { user } from './modules/user';
import mutations from './mutations';
import { State } from './types';

let colorList = uni.getStorageSync('COLOR_LIST');
if (!colorList) {
  colorList = getRandomColorList(5).map(item => ({ value: item }));
  uni.setStorageSync('COLOR_LIST', colorList);
}
let bgColorList = uni.getStorageSync('BACKGROUND_COLOR_LIST');
if (!bgColorList) {
  bgColorList = getRandomColorList(5).map(item => ({ value: item }));
  bgColorList[0] = { value: 'rgb(255, 255, 255)' };
  uni.setStorageSync('BACKGROUND_COLOR_LIST', bgColorList);
}

const { statusBarHeight = 20, windowWidth } = uni.getSystemInfoSync();
const { top, bottom } = uni.getMenuButtonBoundingClientRect();

const navHeight = top + bottom - 2 * statusBarHeight;

export const initState: State = {
  /** 绘制数据 */
  path: [],
  colorIndex: 0,
  backgroundColorIndex: 0,
  width: 2,
  /** 历史记录数据 */
  currentPathIndex: -1, // 记录path操作记录指针
  historyStepList: [],
  currentStepIndex: -1, // 记录历史步骤指针
  lastStep: undefined, // 历史记录操作最大值的时候，最后一次撤销时 备份需要用/

  env: '',

  colorList,
  bgColorList,

  statusBarHeight,
  navHeight,
  windowWidth,
  headerHeight: statusBarHeight + navHeight,
}

const store = createStore({
  state: initState,
  getters: {
    currentStep: state => state.historyStepList[state.currentStepIndex],
    currentPathList: state => state.path.slice(0, state.currentPathIndex + 1),
    color: state => state.colorList[state.colorIndex].value,
    alpha: state => state.colorList[state.colorIndex].alpha || 1,
    backgroundColor: state => state.bgColorList[state.backgroundColorIndex].value,
    backgroundAlpha: state => state.bgColorList[state.backgroundColorIndex].alpha || 1,
  },
  modules: {
    user,
  },
  mutations,
});

export default store;
