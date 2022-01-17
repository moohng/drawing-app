export interface Dot {
  x: number;
  y: number;
}

export interface Path {
  pos: Dot[];
  color?: string;
  width?: number;
}

export interface State {
  path: Path[];
  color: string;
  backgroundColor: string;
  width: number;
  play: boolean;

  code: string;
  // previewMode: boolean;

  showPreviewCover: boolean;
  showPwdDialog: boolean;
  isSave: boolean;

  /** 操作 */
  preview: boolean;

  env: 'h5' | 'miniProgram' | 'weixin' | '';
}

export enum TypeKeys {
  SET_PATH = 'SET_PATH',
  SET_PLAY = 'SET_PLAY',
  SET_COLOR = 'SET_COLOR',
  SET_WIDTH = 'SET_WIDTH',
  SET_SAVE = 'SET_SAVE',
  SET_CODE = 'SET_CODE',
  SET_PREVIEW = 'SET_PREVIEW',
  SET_PREVIEW_MODE = 'SET_PREVIEW_MODE',
  SET_BACKGROUND_COLOR = 'SET_BACKGROUND_COLOR',
  SET_SHOW_PREVIEW_COVER = 'SET_SHOW_PREVIEW_COVER',
  SET_SHOW_PWD_DIALOG = 'SET_SHOW_PWD_DIALOG',
  SET_ENV = 'SET_ENV',
};
