export interface Dot {
  x: number;
  y: number;
}

export interface Path {
  pos: Dot[];
  color?: string;
  width?: number;
}

export interface ColorList {
  value: string;
}

export interface State {
  path: Path[];
  color: string;
  backgroundColor: string;
  width: number;
  historyStepList: ImageData[];
  currentPathIndex: number;
  currentStepIndex: number;
  lastStep?: ImageData,

  env: 'h5' | 'miniProgram' | 'weixin' | '';

  colorList: ColorList[];
  bgColorList: ColorList[];
}

export enum TypeKeys {
  SET_PATH = 'SET_PATH',
  SET_PLAY = 'SET_PLAY',
  SET_COLOR = 'SET_COLOR',
  SET_WIDTH = 'SET_WIDTH',
  SET_HISTORY_STEP_LIST = 'SET_HISTORY_STEP_LIST',
  SET_BACKGROUND_COLOR = 'SET_BACKGROUND_COLOR',
  SET_ENV = 'SET_ENV',
  SET_RANDOM_COLOR = 'SET_RANDOM_COLOR',
  SET_RANDOM_BACKGROUND_COLOR = 'SET_RANDOM_BACKGROUND_COLOR',
  /** 操作 */
  OPERATION_UNDO = 'OPERATION_UNDO',
  OPERATION_REDO = 'OPERATION_REDO',
  OPERATION_ADD = 'OPERATION_ADD',
  OPERATION_CLEAR = 'OPERATION_CLEAR',
};
