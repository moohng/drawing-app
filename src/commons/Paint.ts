import { Point, PaintType, Path } from '@/store/types';

const { windowWidth, windowHeight, pixelRatio } = uni.getSystemInfoSync();

const canvasId = 'drawCanvas';

export class Paint {
  private readonly defaultWidth = 6;
  private readonly defaultColor = 'rgb(0,0,0)';

  private row = 0;
  private column = 0;
  private stop = false;
  private path: Path[] = [];

  public isComplete = false;

  public canvas?: HTMLCanvasElement

  constructor(public ctx: CanvasRenderingContext2D, canvas?: HTMLCanvasElement) {
    this.setBackground();

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.canvas = canvas;
  }

  setColor(color = this.defaultColor, alpha?: number) {
    this.ctx.strokeStyle = color;
    if (alpha) {
      this.ctx.globalAlpha = alpha > 1 ? alpha * 0.01 : (alpha || 1);
    }
  }

  get color(): string {
    return this.ctx.strokeStyle as string;
  }

  set width(width: number) {
    this.ctx.lineWidth = width || this.defaultWidth;
  }

  get width(): number {
    return this.ctx.lineWidth;
  }

  get background(): string {
    return this.ctx.fillStyle as string;
  }

  /**
   * 开始绘制轨迹
   * @param point 坐标点
   * @param color 轨迹颜色
   * @param width 轨迹宽度
   */
  start({ x, y }: Point, { color = this.defaultColor, width = this.defaultWidth, alpha = 1, type = PaintType.PEN }) {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.setColor(color, alpha);
    this.width = width;
    this.ctx.globalCompositeOperation = type === PaintType.ERASER ? 'destination-out' : 'source-over';
  }

  /**
   * 设置背景
   * @param color 背景颜色
   */
  setBackground(color?: string, under = false) {
    if (!color) return;
    this.ctx.fillStyle = color;
    under && (this.ctx.globalCompositeOperation = 'destination-over');
    this.ctx.fillRect(-windowWidth * 0.5, -windowHeight * 0.5, windowWidth, windowHeight);
    under && (this.ctx.globalCompositeOperation = 'source-out');
    // #ifndef MP
    // @ts-ignore
    this.ctx.draw(true);
    // #endif
  }

  /**
   * 清空画布
   */
  clear() {
    this.ctx.clearRect(-windowWidth * 0.5, -windowHeight * 0.5, windowWidth, windowHeight);
    // #ifndef MP
    // @ts-ignore
    this.ctx.draw(true);
    // #endif
  }

  private endPoint?: Point;

  /**
   * 绘制轨迹
   * @param param 坐标点
   */
   drawLine({ x, y }: Point, lastPoint?: Point) {
    if (lastPoint) {
      const ep = {
        x: lastPoint.x + (x - lastPoint.x) * 0.5,
        y: lastPoint.y + (y - lastPoint.y) * 0.5,
      }
      this.ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, ep.x, ep.y);
      this.ctx.stroke();
      this.endPoint = ep;
    } else {
      this.ctx.lineTo(x, y);
      this.ctx.stroke();
      this.endPoint = { x, y };
    }
    // #ifndef MP
    // @ts-ignore
    this.ctx.draw(true);
    this.ctx.moveTo(this.endPoint.x, this.endPoint.y);
    // #endif
  }

  drawPath(path: Path[], completed?: () => void) {
    if (!path.length) return Promise.resolve();
    for (let i = 0, len = path.length; i < len; i++) {
      const { points, color, width, type } = path[i];
      this.start(points[0], { color, width, type });
      for (let j = 1, len = points.length; j < len; j++) {
        const { x, y } = points[j];
        if (j === len - 1) {
          this.ctx.lineTo(x, y);
        } else if (j > 1) {
          const lastPoint = points[j - 1]
          const ep = {
            x: lastPoint.x + (x - lastPoint.x) * 0.5,
            y: lastPoint.y + (y - lastPoint.y) * 0.5,
          }
          this.ctx.quadraticCurveTo(lastPoint.x, lastPoint.y, ep.x, ep.y);
        }
      }
      this.ctx.stroke();
    }
  }

  /**
   * 从头绘制路径
   * @param path 路径
   * @param completed 完成回调
   * @returns
   */
  playPath({ path, onFrame }: {
    path: Path[];
    onFrame?: () => void;
  }) {
    if (!path.length) {
      throw new Error('path 参数不能为空');
    }

    this.path = path;

    // 初始化
    this.row = 0;
    this.column = 0;
    this.stop = false;
    this.isComplete = false;

    const { points, color, width, type } = path[0];
    this.start(points[0], { color, width, type });

    return new Promise(resolve => {
      this.run(() => resolve(0), onFrame);
    });
  }

  private onCompleted() {}

  private run(onCompleted?: () => void, onFrame?: () => void) {
    onCompleted && (this.onCompleted = onCompleted);

    // 结束绘制（下一次播放的时候要结束上一次播放）
    if (this.stop) {
      return;
    }

    const { points } = this.path[this.row];
    if (this.column < points.length) {
      // 绘制第 n 条轨迹
      if (this.column < 2 || this.column >= points.length - 1) {
        this.drawLine(points[this.column]);
      } else {
        if (this.column === 2) {
          // this.clear();
          this.ctx.moveTo(points[0].x, points[0].y);
        }
        this.drawLine(points[this.column], points[this.column - 1]);
      }

      // 完成一帧
      onFrame?.();

      this.column++;
      // @ts-ignore
      this.requestAnimationFrame(() => this.run(onCompleted, onFrame));
    } else {
      // 一条轨迹制完成
      if (++this.row < this.path.length) {
        // 初始化下一条轨迹
        this.column = 0;
        const { points, color, width, type } = this.path[this.row];
        this.start(points[0], { color, width, type });

        // 延时一会儿开始绘制下一条轨迹
        setTimeout(() => {
          // @ts-ignore
          this.requestAnimationFrame(() => this.run(onCompleted, onFrame));
        }, 240);
      } else {
        // 结束
        this.isComplete = true;
        onCompleted?.();
      }
    }
  }

  /**
   * 暂停播放
   */
  pause() {
    this.stop = true;
  }

  /**
   * 继续播放
   * @param completed 完成回调
   */
  play(onCompleted = this.onCompleted) {
    this.stop = false;
    this.run(onCompleted);
  }

  getImageData() {
    /**
     * ! 内存暂用太大了
     * todo: 可优化点，不用每次都保存整张画布，而是根据当前绘制的笔记自动计算出对应大小的画布和位置，减少内存占用
     * 方法：遍历当前笔记坐标数组，找到最小 (x, y) 和 最大 (x, y) 的值，并记录起来，下次在对应位置再进行绘制
     */
    // #ifdef MP-WEIXIN
    return this.ctx.getImageData(0, 0, windowWidth * pixelRatio, windowHeight * pixelRatio);
    // #endif
    // #ifndef MP-WEIXIN
    return new Promise((resolve, reject) => {
      uni.canvasGetImageData({
        canvasId,
        x: 0,
        y: 0,
        width: windowWidth,
        height: windowHeight,
        success: ({ data }) => {
          resolve(data);
        },
        fail: reject,
      });
    });
    // #endif
  }

  setImageData(imageData?: ImageData) {
    // #ifdef MP-WEIXIN
    imageData && this.ctx.putImageData(imageData, 0, 0);
    // #endif
    // #ifndef MP-WEIXIN
    imageData && uni.canvasPutImageData({ canvasId, x: 0, y: 0, width: windowWidth * pixelRatio, height: windowHeight * pixelRatio, data: imageData });
    // #endif
  }

  drawImage(url: string) {
    // #ifdef MP
    // @ts-ignore
    const image = this.canvas.createImage();
    image.onload = () => {
      const width = windowWidth;
      const height = width * image.height / image.width;
      this.ctx.drawImage(image, -width * 0.5, -height * 0.5, width, height);
    };
    image.src = url;
    // #endif
    // #ifndef MP
    // @ts-ignore
    this.ctx.drawImage(url, 0, 0);
    // #endif
  }

  requestAnimationFrame(callback: FrameRequestCallback) {
    // #ifdef MP
    // @ts-ignore
    return this.canvas?.requestAnimationFrame(callback);
    // #endif
    // #ifdef H5
    return window.requestAnimationFrame(callback);
    // #endif
    return setTimeout(callback, 16.7);
  }

  toDataURL(type?: string, quality?: any) {
    return this.canvas?.toDataURL(type, quality) as string;
  }
}
