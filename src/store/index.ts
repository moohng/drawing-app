import { defineStore } from 'pinia';
import { generalThemeColor, getRandomColorList } from '@/commons/utils';
import { PaintType } from './types';
import { MAX_HISTORY_COUNT } from '@/commons/config';

export const useStore = defineStore('main', {
  state() {
    let colorList = uni.getStorageSync('COLOR_LIST');
    if (!colorList) {
      colorList = getRandomColorList(5).map((item) => ({ value: item }));
      uni.setStorageSync('COLOR_LIST', colorList);
    }
    let bgColorList = uni.getStorageSync('BACKGROUND_COLOR_LIST');
    if (!bgColorList) {
      bgColorList = getRandomColorList(5).map((item) => ({ value: item }));
      bgColorList[0] = { value: 'rgb(255, 255, 255)' };
      uni.setStorageSync('BACKGROUND_COLOR_LIST', bgColorList);
    }

    return {
      /** 绘制数据 */
      path: [],
      colorIndex: 0,
      backgroundColorIndex: 0,
      width: 2,
      cacheWidth: 2,
      paintType: PaintType.PEN,
      /** 历史记录数据 */
      currentPathIndex: -1, // 记录path操作记录指针
      historyStepList: [],
      currentStepIndex: -1, // 记录历史步骤指针
      lastStep: undefined, // 历史记录操作最大值的时候，最后一次撤销时 备份需要用/

      colorList,
      bgColorList,
    };
  },
  getters: {
    currentStep: (state) => state.historyStepList[state.currentStepIndex],
    currentPathList: (state) => state.path.slice(0, state.currentPathIndex + 1),
    color: (state) => state.colorList[state.colorIndex].value,
    alpha: (state) => state.colorList[state.colorIndex].alpha || 1,
    backgroundColor: (state) => state.bgColorList[state.backgroundColorIndex].value,
    backgroundAlpha: (state) => state.bgColorList[state.backgroundColorIndex].alpha || 1,
    themeColor() {
      return generalThemeColor(this.color as unknown as string, 90, 90);
    },
    themeBgColor() {
      return generalThemeColor(this.color as unknown as string, 10, 100, 0.9);
    },
  },
  actions: {
    setColorIndex(colorIndex: number) {
      this.colorIndex = colorIndex;
      if (this.paintType === PaintType.ERASER) {
        this.paintType = PaintType.PEN;
        this.width = this.cacheWidth;
      }
    },
    setBackgroundColorIndex(backgroundColorIndex: number) {
      this.backgroundColorIndex = backgroundColorIndex;
    },
    setWidth(width: number) {
      this.width = width;
      if (this.paintType !== PaintType.ERASER) {
        this.cacheWidth = width;
      }
    },
    setPaintType(paintType: PaintType) {
      this.paintType = paintType;
      if (paintType === PaintType.ERASER) {
        this.width = 20;
      } else {
        this.width = this.cacheWidth;
      }
    },
    operationUndo() {
      if (this.currentStepIndex > -1) {
        this.currentStepIndex--;
        this.currentPathIndex--;
      }
      console.log('撤销', this.currentPathIndex, this.currentStepIndex);
    },
    operationRedo() {
      if (this.currentStepIndex < this.historyStepList.length - 1) {
        this.currentStepIndex++;
        this.currentPathIndex++;
      }
      // console.log('恢复', this.currentPathIndex, this.currentStepIndex);
    },
    operationAdd({ currentLine, currentImageData }: any) {
      // 保存路径
      this.currentPathIndex++;
      this.path = this.path.slice(0, this.currentPathIndex).concat(currentLine);

      // 历史记录
      if (this.currentStepIndex >= MAX_HISTORY_COUNT - 1) {
        // 历史记录已满
        const [last, ...list] = this.historyStepList.concat(currentImageData);
        this.lastStep = last;
        this.historyStepList = list;
      } else {
        this.currentStepIndex++;
        this.historyStepList = this.historyStepList.slice(0, this.currentStepIndex).concat(currentImageData);
      }
      console.log('添加', this.currentPathIndex, this.currentStepIndex, this.historyStepList);
    },
    operationClear() {
      this.currentPathIndex = -1;
      this.currentStepIndex = -1;
      this.path = [];
      this.historyStepList = [];
      this.lastStep = undefined;
    },
    editColorListByIndex(color: { value: string; alpha: number }) {
      this.colorList[this.colorIndex] = color;
      uni.setStorageSync('COLOR_LIST', this.colorList);
    },
    editBackgroundColorByIndex(color: { value: string; alpha: number }) {
      this.bgColorList[this.backgroundColorIndex] = color;
      uni.setStorageSync('BACKGROUND_COLOR_LIST', this.bgColorList);
    },
  },
});
