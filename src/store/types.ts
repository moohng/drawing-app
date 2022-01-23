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

  env: 'h5' | 'miniProgram' | 'weixin' | '';

  colorList: ColorList[];
  bgColorList: ColorList[];
}

export enum TypeKeys {
  SET_PATH = 'SET_PATH',
  SET_PLAY = 'SET_PLAY',
  SET_COLOR = 'SET_COLOR',
  SET_WIDTH = 'SET_WIDTH',
  SET_BACKGROUND_COLOR = 'SET_BACKGROUND_COLOR',
  SET_ENV = 'SET_ENV',
  SET_RANDOM_COLOR = 'SET_RANDOM_COLOR',
  SET_RANDOM_BACKGROUND_COLOR = 'SET_RANDOM_BACKGROUND_COLOR',
};
