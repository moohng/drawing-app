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

export interface PaintPath {
  path: Path[];
  background?: string;
  title?: string;
  imgUrl?: string;
}
