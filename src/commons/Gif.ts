// @ts-ignore
import GIF from 'gif.js';

GIF.prototype.finishRendering = function() {
  var data, frame, i, image, j, k, l, len, len1, len2, len3, offset, page, ref, ref1, ref2;
  len = 0;
  ref = this.imageParts;
  for (j = 0, len1 = ref.length; j < len1; j++) {
    frame = ref[j];
    len += (frame.data.length - 1) * frame.pageSize + frame.cursor;
  }
  len += frame.pageSize - frame.cursor;
  this.log('rendering finished - filesize ' + Math.round(len / 1e3) + 'kb');
  data = new Uint8Array(len);
  offset = 0;
  ref1 = this.imageParts;
  for (k = 0, len2 = ref1.length; k < len2; k++) {
    frame = ref1[k];
    ref2 = frame.data;
    for (i = l = 0, len3 = ref2.length; l < len3; i = ++l) {
      page = ref2[i];
      // data.set(page, offset);
      for (var _i = 0; _i < frame.pageSize; _i++) {
        data[offset + _i] = page[_i];
      }
      if (i === frame.data.length - 1) {
        offset += frame.cursor;
      } else {
        offset += frame.pageSize;
      }
    }
  }
  let worker = this.freeWorkers.shift();
  // console.log('worker', worker)
  worker.terminate(); // 销毁多线程
  // image = new Blob([data],{
  //     type: "image/gif"
  // });
  return this.emit('finished', data);
  // return this.emit("finished", image, data)
};

GIF.prototype.addFrame = function(image: any, options: any) {
  var frame: any = {},
    key;
  if (options == null) {
    options = {};
  }
  frame.index = options.index || 0;
  frame.transparent = this.options.transparent;
  for (key in this.frameDefaults) {
    frame[key] = options[key] || this.frameDefaults[key];
  }
  if (this.options.width == null) {
    this.setOption('width', image.width);
  }
  if (this.options.height == null) {
    this.setOption('height', image.height);
  }
  if (image?.width && image?.height && image?.data) {
    frame.data = image.data;
    // } else if (typeof ImageData !== "undefined" && ImageData !== null && image instanceof ImageData) {
    //     frame.data = image.data
    // } else if (typeof CanvasRenderingContext2D !== "undefined" && CanvasRenderingContext2D !== null && image instanceof CanvasRenderingContext2D || typeof WebGLRenderingContext !== "undefined" && WebGLRenderingContext !== null && image instanceof WebGLRenderingContext) {
    //     if (options.copy) {
    //         frame.data = this.getContextData(image)
    //     } else {
    //         frame.context = image
    //     }
    // } else if (image.childNodes != null) {
    //     if (options.copy) {
    //         frame.data = this.getImageData(image)
    //     } else {
    //         frame.image = image
    //     }
  } else {
    throw new Error('Invalid image');
  }
  return this.frames.push(frame);
};

export default GIF;
