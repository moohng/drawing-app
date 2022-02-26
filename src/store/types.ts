export interface Point {
  x: number;
  y: number;
}

export enum PaintType {
  PEN = 'PEN', // 画笔，默认
  ERASER = 'ERASER', // 橡皮擦
}

export interface Path {
  points: Point[];
  color?: string;
  width?: number;
  type?: PaintType;
}

export interface ColorOption {
  value: string;
  alpha?: number;
}

export interface State {
  path: Path[];
  colorIndex: number;
  backgroundColorIndex: number;
  width: number;
  cacheWidth: number;
  paintType: PaintType;
  historyStepList: ImageData[];
  currentPathIndex: number;
  currentStepIndex: number;
  lastStep?: ImageData,

  env: 'h5' | 'miniProgram' | 'weixin' | '';

  colorList: ColorOption[];
  bgColorList: ColorOption[];

  statusBarHeight: number,
  navHeight: number,
  windowWidth: number,
  headerHeight: number,

  openid: string;
}

export enum TypeKeys {
  SET_PATH = 'SET_PATH',
  SET_PLAY = 'SET_PLAY',
  SET_COLOR_INDEX = 'SET_COLOR_INDEX',
  SET_WIDTH = 'SET_WIDTH',
  SET_PAINT_TYPE = 'SET_PAINT_TYPE',
  SET_BACKGROUND_COLOR_INDEX = 'SET_BACKGROUND_COLOR_INDEX',
  SET_ENV = 'SET_ENV',
  EDIT_COLOR_LIST_BY_INDEX = 'EDIT_COLOR_LIST_BY_INDEX',
  EDIT_BACKGROUND_LIST_BY_INDEX = 'EDIT_BACKGROUND_LIST_BY_INDEX',
  /** 操作 */
  OPERATION_UNDO = 'OPERATION_UNDO',
  OPERATION_REDO = 'OPERATION_REDO',
  OPERATION_ADD = 'OPERATION_ADD',
  OPERATION_CLEAR = 'OPERATION_CLEAR',
  /** 用户信息 */
  SET_OPENID = 'SET_OPENID',
};
